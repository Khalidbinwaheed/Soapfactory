"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/auth"
import bcrypt from "bcryptjs"

const settingsSchema = z.object({
  companyName: z.string().min(2),
  currency: z.string().default("USD"),
  taxRate: z.coerce.number().min(0),
  invoicePrefix: z.string().optional(),
  lowStockLimit: z.coerce.number().min(1),
  paymentMethods: z.string().optional(), 
})

const profileSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().optional(),
    image: z.string().optional(),
})

const passwordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6)
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

export async function getSystemSettings() {
    try {
        const settings = await db.settings.findFirst()
        if (!settings) {
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
    const validated = profileSchema.safeParse(rawData)

    if (!validated.success) {
        return { message: "Invalid fields", errors: validated.error.flatten().fieldErrors }
    }

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: {
                name: validated.data.name,
                image: validated.data.image,
                phone: validated.data.phone,
                company: validated.data.company
            }
        })
        revalidatePath("/")
        return { message: "Profile updated", success: true }
    } catch (e) {
        return { message: "Failed to update profile" }
    }
}

export async function changePassword(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { message: "Unauthorized" }
    
    const rawData = Object.fromEntries(formData.entries())
    const validated = passwordSchema.safeParse(rawData)

    if (!validated.success) {
        return { message: "Invalid fields", errors: validated.error.flatten().fieldErrors }
    }

    const { currentPassword, newPassword } = validated.data

    try {
        const user = await db.user.findUnique({ where: { id: session.user.id } })
        if (!user || !user.password) return { message: "User not found" }

        const passwordsMatch = await bcrypt.compare(currentPassword, user.password)
        if (!passwordsMatch) {
            return { message: "Incorrect current password" }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await db.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword }
        })

        return { message: "Password updated successfully", success: true }
    } catch (e) {
        return { message: "Failed to update password" }
    }
}
