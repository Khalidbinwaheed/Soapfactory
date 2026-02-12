"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/auth"

const settingsSchema = z.object({
  companyName: z.string().min(2),
  currency: z.string().default("USD"),
  taxRate: z.coerce.number().min(0),
  invoicePrefix: z.string().optional(),
  lowStockLimit: z.coerce.number().min(1),
})

const profileSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    // password updates usually handled separately for security
})

export async function getSystemSettings() {
    try {
        const settings = await db.settings.findFirst()
        if (!settings) {
            // Create default if not exists
            return await db.settings.create({
                data: {}
            })
        }
        return settings
    } catch (e) {
        return null
    }
}

export async function updateSystemSettings(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries())
    const validated = settingsSchema.safeParse(rawData)

    if (!validated.success) {
        return { message: "Invalid fields", errors: validated.error.flatten().fieldErrors }
    }

    try {
        const first = await db.settings.findFirst()
        const id = first?.id

        if (id) {
            await db.settings.update({
                where: { id },
                data: validated.data
            })
        } else {
            await db.settings.create({
                data: validated.data
            })
        }
        
        revalidatePath("/dashboard/settings")
        return { message: "System settings updated", success: true }
    } catch (e) {
        return { message: "Failed to update settings" }
    }
}

export async function updateProfile(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { message: "Unauthorized" }

    const rawData = Object.fromEntries(formData.entries())
    // Allow partial updates or just what's in schema
    const validated = profileSchema.safeParse({ name: rawData.name, email: rawData.email })

    if (!validated.success) {
        return { message: "Invalid fields", errors: validated.error.flatten().fieldErrors }
    }

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: validated.data
        })
        revalidatePath("/") // invalidate session potentially
        return { message: "Profile updated", success: true }
    } catch (e) {
        return { message: "Failed to update profile" }
    }
}
