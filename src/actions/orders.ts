"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { OrderStatus, PaymentStatus } from "@prisma/client"
import { logActivity } from "@/lib/activity-logger"

const orderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
})

const orderSchema = z.object({
  userId: z.string().min(1, "Customer is required"),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
  tax: z.coerce.number().optional().default(0),
  discount: z.coerce.number().optional().default(0),
})

export async function createOrderAction(prevState: any, formData: FormData) {
    const rawData: any = Object.fromEntries(formData.entries())
    
    if (rawData.items) {
        try {
            rawData.items = JSON.parse(rawData.items)
        } catch (e) {
            return { message: "Invalid items format" }
        }
    }

    const validated = orderSchema.safeParse(rawData)

    if (!validated.success) {
        return { message: "Invalid fields", errors: validated.error.flatten().fieldErrors }
    }

    const { userId, status, items, notes, tax, discount } = validated.data
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const totalAmount = subtotal + tax - discount

    let orderId = "";

    try {
        await db.$transaction(async (tx) => {
             const orderNumber = `ORD-${Date.now().toString().slice(-6)}`
             const order = await tx.order.create({
                 data: {
                     orderNumber,
                     userId,
                     status,
                     subtotal,
                     tax,
                     discount,
                     totalAmount,
                     notes
                 }
             })
             orderId = order.id;

             for (const item of items) {
                 await tx.orderItem.create({
                     data: {
                         orderId: order.id,
                         productId: item.productId,
                         quantity: item.quantity,
                         price: item.price
                     }
                 })
                 
                 await tx.inventory.update({
                     where: { productId: item.productId },
                     data: {
                         quantity: { decrement: item.quantity },
                         totalOut: { increment: item.quantity },
                         lastMovement: new Date()
                     }
                 })
             }

             // Auto Generate Invoice
             const invoiceNumber = `INV-${orderNumber.split('-')[1]}`
             await tx.invoice.create({
                 data: {
                     invoiceNumber,
                     orderId: order.id,
                     amount: totalAmount,
                     status: PaymentStatus.UNPAID,
                     dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                 }
             })

             // Notification
             await tx.notification.create({ // using tx for notification to ensure consistency? or separate? 
                 data: {
                     userId,
                     title: "Order Placed",
                     message: `Your order #${orderNumber} has been placed successfully.`,
                     type: "ORDER",
                     link: `/dashboard/orders/${order.id}`
                 }
             })
        })

        // Log Activity outside transaction to avoid blocking? 
        // We need orderId, which we got.
        if(orderId) {
            await logActivity(userId, "CREATED_ORDER", "ORDER", orderId, `Order placed with total ${totalAmount}`)
        }

    } catch (e) {
        console.error(e)
        return { message: "Failed to create order. Check stock levels." }
    }

    revalidatePath("/dashboard/orders")
    redirect("/dashboard/orders")
}

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
    try {
        await db.$transaction(async (tx) => {
             const order = await tx.order.update({
                where: { id },
                data: { status },
                include: { user: true }
            })

            // Trigger Notification
            await tx.notification.create({
                data: {
                    userId: order.userId,
                    title: `Order ${status}`,
                    message: `Your order #${order.orderNumber} is now ${status}.`,
                    type: "ORDER",
                    link: `/dashboard/orders/${order.id}`
                }
            })
        })

        revalidatePath("/dashboard/orders")
        return { message: "Order status updated" }
    } catch (e) {
        return { message: "Failed to update order status" }
    }
}


export async function deleteOrderAction(id: string) {
     try {
        await db.order.delete({
            where: { id }
        })
        revalidatePath("/dashboard/orders")
        return { message: "Order deleted" }
    } catch (e) {
        return { message: "Failed to delete order" }
    }
}
