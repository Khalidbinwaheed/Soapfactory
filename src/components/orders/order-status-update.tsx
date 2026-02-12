"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateOrderStatusAction } from "@/actions/orders"
import { OrderStatus } from "@prisma/client"
import { useTransition, useState } from "react"
import { toast } from "sonner" // Assuming sonner is installed, or use standard alert/toast. standard alert for now to be safe.

interface OrderStatusUpdateProps {
    orderId: string
    currentStatus: OrderStatus
}

export function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
    const [isPending, startTransition] = useTransition()
    const [status, setStatus] = useState(currentStatus)

    const handleValueChange = (value: string) => {
        const newStatus = value as OrderStatus
        setStatus(newStatus)
        startTransition(async () => {
            const result = await updateOrderStatusAction(orderId, newStatus)
            if (result.message !== "Order status updated") {
                 // Revert on failure
                 setStatus(currentStatus)
                 toast.error("Failed to update status")
            }
        })
    }

    return (
        <Select onValueChange={handleValueChange} value={status} disabled={isPending}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                {Object.values(OrderStatus).map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
