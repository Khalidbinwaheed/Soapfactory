"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { updateShipmentAction } from "@/actions/shipping"
import { useTransition, useState } from "react"
import { Shipment } from "@prisma/client"

const shipmentSchema = z.object({
  carrier: z.string().optional(),
  trackingNumber: z.string().optional(),
  status: z.string().optional(),
  shippedDate: z.string().optional(),
  deliveryDate: z.string().optional(),
})

type ShipmentFormValues = z.infer<typeof shipmentSchema>

interface ShipmentFormProps {
  orderId: string
  initialData?: Shipment | null
}

export function ShipmentForm({ orderId, initialData }: ShipmentFormProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      carrier: initialData?.carrier || "",
      trackingNumber: initialData?.trackingNumber || "",
      status: initialData?.status || "",
      shippedDate: initialData?.shippedDate ? new Date(initialData.shippedDate).toISOString().split('T')[0] : "",
      deliveryDate: initialData?.deliveryDate ? new Date(initialData.deliveryDate).toISOString().split('T')[0] : "",
    },
  })

  function onSubmit(data: ShipmentFormValues) {
    setMessage(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append("orderId", orderId)
      if(data.carrier) formData.append("carrier", data.carrier)
      if(data.trackingNumber) formData.append("trackingNumber", data.trackingNumber)
      if(data.status) formData.append("status", data.status)
      if(data.shippedDate) formData.append("shippedDate", data.shippedDate)
      if(data.deliveryDate) formData.append("deliveryDate", data.deliveryDate)

      const result = await updateShipmentAction(null, formData)
      if (result && result.message) {
          setMessage(result.message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {message && <div className="text-sm p-2 bg-muted rounded">{message}</div>}
        
        <div className="grid gap-4 md:grid-cols-2">
            <FormField
            control={form.control}
            name="carrier"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Carrier</FormLabel>
                <FormControl>
                    <Input placeholder="DHL, FedEx..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="trackingNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tracking Number</FormLabel>
                <FormControl>
                    <Input placeholder="TRACK-123" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

         <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                    <Input placeholder="In Transit" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

        <div className="grid gap-4 md:grid-cols-2">
            <FormField
            control={form.control}
            name="shippedDate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Shipped Date</FormLabel>
                <FormControl>
                    <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Delivery Date</FormLabel>
                <FormControl>
                    <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" disabled={isPending}>Save Shipment Details</Button>
      </form>
    </Form>
  )
}
