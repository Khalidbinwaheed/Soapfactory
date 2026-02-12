import { db } from "@/lib/db"
import { columns } from "@/components/orders/columns"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

import { auth } from "@/auth"

async function getOrders() {
  const session = await auth()
  const user = session?.user

  if (!user) return []

  const whereClause: any = {}
  if (user.role === 'CLIENT') {
      whereClause.userId = user.id
  }

  const orders = await db.order.findMany({
    where: whereClause,
    include: {
      user: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return orders
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
        <Button asChild>
            <Link href="/dashboard/orders/new">
                <Plus className="mr-2 h-4 w-4" /> Create Order
            </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={orders} searchKey="orderNumber" />
      {/* Note: searchKey 'orderNumber' works if accessor is that. */}
    </div>
  )
}
