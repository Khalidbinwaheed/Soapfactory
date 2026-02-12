"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createNotification } from "@/actions/notifications"
import { getSystemSettings } from "@/actions/settings"

const adjustmentSchema = z.object({
  id: z.string(),
  quantity: z.coerce.number(),
  reason: z.string().optional(),
  type: z.enum(["ADD", "REMOVE", "SET"])
})

export async function adjustStockAction(prevState: any, formData: FormData) {
    // ... (keep existing implementation or enhance)
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
        const inventory = await db.inventory.findUnique({ where: { id }, include: { product: true } })
        if (!inventory) return { message: "Inventory record not found" }

        let newQuantity = inventory.quantity
        let totalIn = inventory.totalIn
        let totalOut = inventory.totalOut

        if (type === "ADD") {
            newQuantity += quantity
            totalIn += quantity
        }
        else if (type === "REMOVE") {
            newQuantity -= quantity
            totalOut += quantity
        }
        else if (type === "SET") {
            // Determines if we added or removed to reach SET
            const diff = quantity - inventory.quantity
            if (diff > 0) totalIn += diff
            else totalOut += Math.abs(diff)
            newQuantity = quantity
        }

        if (newQuantity < 0) return { message: "Stock cannot be negative" }

        await db.inventory.update({
            where: { id },
            data: { 
                quantity: newQuantity,
                totalIn,
                totalOut,
                lastMovement: new Date()
            }
        })

        // Check Low Stock
        const settings = await getSystemSettings()
        const lowStockLimit = settings?.lowStockLimit || 10
        
        if (newQuantity <= lowStockLimit) {
            // Find admins to notify
            const admins = await db.user.findMany({ where: { role: { in: ["ADMIN", "MANAGER", "SUPER_ADMIN"] } } })
            
            // This could be spammy if not debounced, but ok for now
            for (const admin of admins) {
                 await createNotification(admin.id, "Low Stock Alert", `Product ${inventory.product.name} is low on stock (${newQuantity}).`)
            }
        }

    } catch (e) {
        return { message: "Failed to update stock" }
    }

    revalidatePath("/dashboard/inventory")
    return { message: "Stock updated successfully", success: true }
}
