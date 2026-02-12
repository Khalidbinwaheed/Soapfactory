import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { Package, FileText, Truck } from "lucide-react"

async function getClientStats(userId: string) {
    const ordersCount = await db.order.count({ where: { userId } })
    const invoicesCount = await db.invoice.count({ where: { order: { userId } } })
    // const shipmentsCount = await db.shipment.count({ where: { order: { userId } } }) // Shipment relation might not be direct?
    // Shipment is 1-1 with order.
    const shipmentsCount = await db.shipment.count({
        where: {
            order: { userId }
        }
    })

    return { ordersCount, invoicesCount, shipmentsCount }
}

export async function ClientDashboard({ userId }: { userId: string }) {
  const stats = await getClientStats(userId)

  return (
    <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.invoicesCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shipmentsCount}</div>
          </CardContent>
        </Card>
    </div>
  )
}
