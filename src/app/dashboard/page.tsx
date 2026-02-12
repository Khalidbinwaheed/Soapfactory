import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { db } from "@/lib/db"
import { CreditCard, DollarSign, Package, Users, Activity } from "lucide-react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard"

async function getAdminStats() {
    const totalRevenue = await db.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: "CANCELLED" } }
    })
    
    const totalOrders = await db.order.count({
         where: { status: { not: "CANCELLED" } }
    })

    const activeUsers = await db.user.count({
        where: { role: "CLIENT" } // Assuming active users are clients
    })

    const lowStockCount = await db.inventory.count({
        where: { quantity: { lte: 10 } }
    })
    
    return {
        totalRevenue: Number(totalRevenue._sum.totalAmount) || 0,
        totalOrders,
        activeUsers,
        lowStockCount
    }
}

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
      redirect("/auth/login")
  }

  if (session.user.role === "CLIENT") {
      return <ClientDashboard userId={session.user.id} />
  }

  if (session.user.role === "MANAGER") {
      return <ManagerDashboard />
  }

  // Admin Dashboard (Default)
  const stats = await getAdminStats()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.totalOrders}</div>
             <p className="text-xs text-muted-foreground">
              +19 New orders
            </p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.activeUsers}</div>
             <p className="text-xs text-muted-foreground">
              +2 since last hour
            </p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Low Stock Items
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.lowStockCount}</div>
                 <p className="text-xs text-muted-foreground">
                  Needs attention
                </p>
            </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
             <div className="text-sm text-muted-foreground">
              You made {stats.totalOrders} sales this month.
            </div>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

