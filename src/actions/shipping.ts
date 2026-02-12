"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { OrderStatus } from "@prisma/client"

const shipmentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  carrier: z.string().optional(),
  trackingNumber: z.string().optional(),
  status: z.string().optional(),
  shippedDate: z.string().optional(), // Date string from input
  deliveryDate: z.string().optional(),
})

export async function getShipments() {
  try {
    const shipments = await db.shipment.findMany({
        include: {
            order: {
                include: {
                    user: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
    return shipments
  } catch (e) {
      return []
  }
}

export async function updateShipmentAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries())
    const validated = shipmentSchema.safeParse(rawData)

    if (!validated.success) {
        return { message: "Invalid fields", errors: validated.error.flatten().fieldErrors }
    }

    const { orderId, carrier, trackingNumber, status, shippedDate, deliveryDate } = validated.data

    try {
        await db.$transaction(async (tx) => {
             // Upsert Shipment
             await tx.shipment.upsert({
                 where: { orderId },
                 update: {
                     carrier,
                     trackingNumber,
                     status,
                     shippedDate: shippedDate ? new Date(shippedDate) : undefined,
                     deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined
                 },
                 create: {
                     orderId,
                     carrier,
                     trackingNumber,
                     status,
                     shippedDate: shippedDate ? new Date(shippedDate) : undefined,
                     deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined
                 }
             })

             // Auto update order status if shipped
             if (trackingNumber && shippedDate) {
                 await tx.order.update({
                     where: { id: orderId },
                     data: { status: OrderStatus.SHIPPED }
                 })
             }
        })
    } catch (e) {
        return { message: "Failed to save shipment details" }
    }

    revalidatePath(`/dashboard/orders/${orderId}`)
    revalidatePath(`/dashboard/shipments`)
    return { message: "Shipment details saved", success: true }
}
