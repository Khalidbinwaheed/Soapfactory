"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const adjustmentSchema = z.object({
  id: z.string(),
  quantity: z.coerce.number(),
  reason: z.string().optional(),
  type: z.enum(["ADD", "REMOVE", "SET"])
})

export async function adjustStockAction(prevState: any, formData: FormData) {
    const rawData = {
        id: formData.get("id"),
        quantity: formData.get("quantity"),
        reason: formData.get("reason"),
        type: formData.get("type"),
    }

    const validated = adjustmentSchema.safeParse(rawData)

    if (!validated.success) {
        return { message: "Invalid data" }
    }

    const { id, quantity, type } = validated.data

    try {
        const inventory = await db.inventory.findUnique({ where: { id } })
        if (!inventory) return { message: "Inventory record not found" }

        let newQuantity = inventory.quantity
        if (type === "ADD") newQuantity += quantity
        else if (type === "REMOVE") newQuantity -= quantity
        else if (type === "SET") newQuantity = quantity

        if (newQuantity < 0) return { message: "Stock cannot be negative" }

        await db.inventory.update({
            where: { id },
            data: { quantity: newQuantity }
        })

        // Ideally track this adjustment in a transaction log (InventoryLog model if it existed, or Notification)
        
    } catch (e) {
        return { message: "Failed to update stock" }
    }

    revalidatePath("/dashboard/inventory")
    return { message: "Stock updated successfully", success: true }
}
