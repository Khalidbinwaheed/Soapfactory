"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createNotification(userId: string, title: string, message: string) {
    try {
        await db.notification.create({
            data: {
                userId,
                title,
                message,
                isRead: false
            }
        })
        return { success: true }
    } catch (e) {
        console.error("Failed to create notification", e)
        return { success: false }
    }
}

export async function getNotifications(userId: string) {
    try {
        return await db.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10
        })
    } catch (e) {
        return []
    }
}

export async function markAsReadAction(id: string) {
    try {
        await db.notification.update({
            where: { id },
            data: { isRead: true }
        })
        revalidatePath("/") // Revalidate everything? or just client side update is enough usually.
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}

export async function markAllAsReadAction(userId: string) {
    try {
        await db.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        })
        revalidatePath("/")
        return { success: true }
    } catch (e) {
        return { success: false }
    }
}
