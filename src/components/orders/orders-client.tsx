"use client"

import { OrdersDataTable } from "@/components/orders/orders-data-table"
import { columns } from "@/components/orders/columns"
import { Order, User } from "@prisma/client"

type OrderWithUser = Order & { user: User | null }

interface OrdersClientProps {
  data: OrderWithUser[]
}

export function OrdersClient({ data }: OrdersClientProps) {
  return <OrdersDataTable columns={columns as any} data={data} />
}
