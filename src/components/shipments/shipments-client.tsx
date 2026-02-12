"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/shipments/columns"
import { Shipment, Order, User } from "@prisma/client"

type ShipmentWithOrder = Shipment & { order: Order & { user: User } }

interface ShipmentsClientProps {
  data: ShipmentWithOrder[]
}

export function ShipmentsClient({ data }: ShipmentsClientProps) {
  return (
    <DataTable columns={columns} data={data} searchKey="order.orderNumber" />
  )
}
