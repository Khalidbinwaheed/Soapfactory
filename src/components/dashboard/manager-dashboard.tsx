import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { AlertTriangle, ClipboardList, Factory } from "lucide-react"

async function getManagerStats() {
    const lowStockCount = await db.inventory.count({
        where: { quantity: { lte: 20 } }
    })
    
    const pendingOrders = await db.order.count({
        where: { status: "PENDING" }
    })
    
    const batchesInProduction = await db.batch.count({
        where: { status: "HOLD" } // Assuming HOLD or specifically IN_PRODUCTION if I add it
    })

    return { lowStockCount, pendingOrders, batchesInProduction }
}

export async function ManagerDashboard() {
  const stats = await getManagerStats()

  return (
    <div className="grid gap-4 md:grid-cols-3">
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
             <p className="text-xs text-muted-foreground">Needs approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Restock needed</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Batches</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.batchesInProduction}</div>
             <p className="text-xs text-muted-foreground">Active batches</p>
          </CardContent>
        </Card>
    </div>
  )
}
