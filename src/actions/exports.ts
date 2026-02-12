"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const exportSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be positive"),
  clientId: z.string().optional(),
  notes: z.string().optional(),
})

export async function createExportAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries())
    const validated = exportSchema.safeParse(rawData)

    if (!validated.success) {
        return { message: "Invalid fields", errors: validated.error.flatten().fieldErrors }
    }

    const { productId, quantity } = validated.data

    try {
        await db.$transaction(async (tx) => {
            // Check stock first
            const inventory = await tx.inventory.findUnique({
                where: { productId }
            })

            if (!inventory || inventory.quantity < quantity) {
                throw new Error("Insufficient stock")
            }

            // Create Export Record
            await tx.export.create({
                data: validated.data
            })

            // Update Inventory
            await tx.inventory.update({
                where: { productId },
                data: {
                    quantity: { decrement: quantity },
                    totalOut: { increment: quantity },
                    lastMovement: new Date()
                }
            })
        })
    } catch (e: any) {
        if (e.message === "Insufficient stock") {
            return { message: "Insufficient stock for this export" }
        }
        return { message: "Failed to process export" }
    }

    revalidatePath("/dashboard/exports")
    revalidatePath("/dashboard/inventory")
    redirect("/dashboard/exports")
}
