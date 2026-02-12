"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { PaymentStatus } from "@prisma/client"
import { redirect } from "next/navigation"

export async function createInvoiceAction(orderId: string) {
    try {
        const order = await db.order.findUnique({
            where: { id: orderId },
            include: { invoice: true }
        })

        if (!order) return { message: "Order not found" }
        if (order.invoice) return { message: "Invoice already exists" }

        const invoiceNumber = `INV-${order.orderNumber.replace('ORD-', '')}`

        await db.invoice.create({
            data: {
                orderId: order.id,
                invoiceNumber,
                amount: order.totalAmount,
                status: PaymentStatus.UNPAID,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days due
            }
        })

        revalidatePath(`/dashboard/orders/${orderId}`)
        return { message: "Invoice created", success: true }
    } catch (e) {
        return { message: "Failed to create invoice" }
    }
}

export async function updateInvoiceStatusAction(id: string, status: PaymentStatus) {
    try {
        await db.invoice.update({
            where: { id },
            data: { 
                status,
                paidDate: status === PaymentStatus.PAID ? new Date() : null
            }
        })
        revalidatePath("/dashboard/invoices")
        return { message: "Invoice status updated" }
    } catch (e) {
        return { message: "Failed to update invoice status" }
    }
}
