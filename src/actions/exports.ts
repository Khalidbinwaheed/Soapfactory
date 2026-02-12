"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const exportSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1),
  clientId: z.string().optional(),
  notes: z.string().optional(),
})

export async function createExportAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries())
    const validated = exportSchema.safeParse(rawData)

    if (!validated.success) {
        return { message: "Invalid fields", errors: validated.error.flatten().fieldErrors }
    }

    const { productId, quantity, clientId, notes } = validated.data

    try {
        await db.$transaction(async (tx) => {
             // Create Export Record
             await tx.export.create({
                 data: {
                     productId,
                     quantity,
                     clientId: clientId || undefined,
                     notes
                 }
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
    } catch (e) {
        return { message: "Failed to log export. Check stock levels." }
    }

    revalidatePath("/dashboard/exports")
    revalidatePath("/dashboard/inventory")
    return { message: "Export logged successfully", success: true }
}

export async function getExports() {
    try {
        return await db.export.findMany({
             orderBy: { date: 'desc' },
             include: { product: true }
        })
    } catch (e) {
        return []
    }
}
