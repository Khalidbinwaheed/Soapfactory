"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const importSchema = z.object({
  materialName: z.string().optional(),
  supplier: z.string().optional(),
  productId: z.string().optional(),
  quantity: z.coerce.number().min(1),
  unit: z.string().optional(),
  cost: z.coerce.number().optional(),
  notes: z.string().optional(),
})

export async function createImportAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries())
    const validated = importSchema.safeParse(rawData)

    if (!validated.success) {
        return { message: "Invalid fields", errors: validated.error.flatten().fieldErrors }
    }

    const { materialName, supplier, productId, quantity, unit, cost, notes } = validated.data

    try {
        await db.$transaction(async (tx) => {
             // Create Import Record
             await tx.import.create({
                 data: {
                     materialName,
                     supplier,
                     productId: productId || undefined,
                     quantity,
                     unit,
                     cost,
                     notes
                 }
             })

             // Update Inventory if Product ID is present
             if (productId) {
                 await tx.inventory.update({
                     where: { productId },
                     data: {
                         quantity: { increment: quantity },
                         totalIn: { increment: quantity },
                         lastMovement: new Date()
                     }
                 })
             }
        })
    } catch (e) {
        return { message: "Failed to create import" }
    }

    revalidatePath("/dashboard/imports")
    revalidatePath("/dashboard/inventory")
    return { message: "Import recorded successfully", success: true }
}

export async function getImports() {
    try {
        return await db.import.findMany({
            orderBy: { date: 'desc' },
            include: { product: true }
        })
    } catch (e) {
        return []
    }
}
