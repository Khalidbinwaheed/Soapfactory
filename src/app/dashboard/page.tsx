import { 
  getDashboardStats, 
  getDashboardCharts, 
  getRecentOrders, 
  getLowStockProducts 
} from "@/actions/dashboard"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { ImportExportChart } from "@/components/dashboard/import-export-chart"
import { ProductMixChart } from "@/components/dashboard/product-mix-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { LowStockList } from "@/components/dashboard/low-stock-list"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
      redirect("/login")
  }

  // Role-based redirection/rendering
  if (session.user.role === "CLIENT") {
      return <ClientDashboard userId={session.user.id} />
  }

  if (session.user.role === "MANAGER") {
      return <ManagerDashboard />
  }

  // Admin Dashboard (Default)
  const stats = await getDashboardStats()
  const charts = await getDashboardCharts()
  const recentOrders = await getRecentOrders()
  const lowStockItems = await getLowStockProducts()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCards stats={stats} />
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
        <ImportExportChart data={charts.importExportTrend} />
        <RevenueChart data={charts.revenueTrend} /> 
      </div>

      {/* Bottom Row: Recent Orders, Product Mix, Low Stock */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-4">
            <RecentOrders orders={recentOrders} />
        </div>
        <div className="col-span-3 space-y-4">
            <ProductMixChart data={charts.productMix} />
            <LowStockList items={lowStockItems} />
        </div>
      </div>
    </div>
  )
}
