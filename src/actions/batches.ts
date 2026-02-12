"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { BatchStatus } from "@prisma/client"

const batchSchema = z.object({
  batchCode: z.string().min(1, "Batch Code is required"),
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  status: z.nativeEnum(BatchStatus).default(BatchStatus.PLANNED),
  manufactureDate: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional(),
  notes: z.string().optional(),
})

export async function createBatchAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries())
    
    // Handle date conversion if strings are empty
    if (!rawData.manufactureDate) delete rawData.manufactureDate;
    if (!rawData.expiryDate) delete rawData.expiryDate;

    const validatedFields = batchSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return { message: "Invalid fields", errors: validatedFields.error.flatten().fieldErrors }
    }

    try {
        const { quantity, ...rest } = validatedFields.data
        await db.batch.create({
            data: {
                ...rest,
                initialQty: quantity,
                availableQty: quantity,
            }
        })
    } catch (e) {
        return { message: "Failed to create batch. Batch Code might be duplicate." }
    }

    revalidatePath("/dashboard/batches")
    redirect("/dashboard/batches")
}

export async function updateBatchAction(id: string, prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries())
    
    // Handle date conversion
    if (!rawData.manufactureDate) delete rawData.manufactureDate;
    if (!rawData.expiryDate) delete rawData.expiryDate;

    const validatedFields = batchSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return { message: "Invalid fields", errors: validatedFields.error.flatten().fieldErrors }
    }

    try {
         const { quantity, ...rest } = validatedFields.data
         await db.batch.update({
            where: { id },
            data: {
                ...rest,
                initialQty: quantity,
                // availableQty: quantity // Maybe don't reset available on update unless intended?
                // But type error requires matching fields or exact structure?
                // validtedFields.data is passed to data.
                // data expects BatchUpdateInput.
                // BatchUpdateInput will have initialQty, availableQty, etc.
                // It won't have `quantity`.
                // So I MUST transform it.
            }
        })
    } catch (e) {
        return { message: "Failed to update batch" }
    }

    revalidatePath("/dashboard/batches")
    redirect("/dashboard/batches")
}

export async function deleteBatchAction(id: string) {
    try {
        await db.batch.delete({
            where: { id }
        })
        revalidatePath("/dashboard/batches")
        return { message: "Batch deleted" }
    } catch (e) {
        return { message: "Failed to delete batch" }
    }
}
