import { db } from "@/lib/db"
import { columns } from "@/components/orders/columns"

export const dynamic = 'force-dynamic'
import { OrdersDataTable } from "@/components/orders/orders-data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ShoppingCart, Clock, CheckCircle } from "lucide-react"

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
  
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length
  const completedOrders = orders.filter(o => o.status === 'DELIVERED').length

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight font-serif">Orders</h1>
           <p className="text-sm text-muted-foreground mt-1">
             Manage and track customer orders
           </p>
        </div>
        
        <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm">
            <Link href="/dashboard/orders/new">
                <Plus className="mr-2 h-4 w-4" /> Create Order
            </Link>
        </Button>
      </div>

       {/* Summary Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-black p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
            </div>
             <div className="bg-white dark:bg-black p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                    <Clock className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold">{pendingOrders}</p>
                </div>
            </div>
             <div className="bg-white dark:bg-black p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Delivered</p>
                    <p className="text-2xl font-bold">{completedOrders}</p>
                </div>
            </div>
       </div>

      <OrdersDataTable columns={columns} data={orders} />
    </div>
  )
}
