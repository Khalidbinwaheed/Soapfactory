"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const importSchema = z.object({
  materialName: z.string().optional(),
  supplier: z.string().min(1, "Supplier is required"),
  productId: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantity must be positive"),
  unit: z.string().default("unit"),
  cost: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
})

export async function createImportAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries())
    const validated = importSchema.safeParse(rawData)

    if (!validated.success) {
        return { message: "Invalid fields", errors: validated.error.flatten().fieldErrors }
    }

    const { productId, quantity } = validated.data

    try {
        await db.$transaction(async (tx) => {
            // Create Import Record
            await tx.import.create({
                data: validated.data
            })

            // Update Inventory if product is linked
            if (productId) {
                const inventory = await tx.inventory.findUnique({
                    where: { productId }
                })

                if (inventory) {
                    await tx.inventory.update({
                        where: { productId },
                        data: {
                            quantity: { increment: quantity },
                            totalIn: { increment: quantity },
                            lastMovement: new Date()
                        }
                    })
                } else {
                     // Create inventory if missing (should exist if product exists due to our product creation logic, but good to be safe)
                     await tx.inventory.create({
                         data: {
                             productId,
                             quantity: quantity,
                             totalIn: quantity
                         }
                     })
                }
            }
        })
    } catch (e) {
        console.error(e)
        return { message: "Failed to process import" }
    }

    revalidatePath("/dashboard/imports")
    revalidatePath("/dashboard/inventory")
    redirect("/dashboard/imports")
}
