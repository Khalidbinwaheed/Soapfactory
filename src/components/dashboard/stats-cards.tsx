import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Package, ShoppingCart } from "lucide-react"

import { formatCurrency } from "@/lib/format"

interface DashboardStatsProps {
  stats: {
    totalProducts: { value: number; change: number }
    totalClients: { value: number; change: number }
    activeOrders: { value: number; pending: number }
    monthlyRevenue: { value: number; change: number }
  }
}

export function StatsCards({ stats }: DashboardStatsProps) {

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <div className="h-4 w-4 text-muted-foreground p-2 box-content bg-orange-100 rounded-lg">
             <Package className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts.value}</div>
          <p className="text-xs text-muted-foreground text-green-600 font-medium">
            +{stats.totalProducts.change} this month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          <div className="h-4 w-4 text-muted-foreground p-2 box-content bg-orange-100 rounded-lg">
            <Users className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalClients.value}</div>
          <p className="text-xs text-muted-foreground text-green-600 font-medium">
            +{stats.totalClients.change} this month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
          <div className="h-4 w-4 text-muted-foreground p-2 box-content bg-orange-100 rounded-lg">
            <ShoppingCart className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeOrders.value}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeOrders.pending} pending
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <div className="h-4 w-4 text-muted-foreground p-2 box-content bg-orange-100 rounded-lg">
            <DollarSign className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue.value)}</div>
          <p className="text-xs text-muted-foreground text-green-600 font-medium">
            +{stats.monthlyRevenue.change.toFixed(1)}% vs last month
          </p>
        </CardContent>
      </Card>
    </>
  )
}
