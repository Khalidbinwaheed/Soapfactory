"use server"

import { db } from "@/lib/db"
import { startOfMonth, subMonths, format, endOfMonth } from "date-fns"

export async function getDashboardStats() {
  const startOfCurrentMonth = startOfMonth(new Date())
  const startOfLastMonth = startOfMonth(subMonths(new Date(), 1))
  const endOfLastMonth = endOfMonth(subMonths(new Date(), 1))

  const [
    totalProducts, 
    newProductsThisMonth,
    totalClients, 
    newClientsThisMonth,
    activeOrders, 
    pendingOrders,
    currentMonthRevenue,
    lastMonthRevenue
  ] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { createdAt: { gte: startOfCurrentMonth } } }),
    db.user.count({ where: { role: "CLIENT" } }),
    db.user.count({ where: { role: "CLIENT", createdAt: { gte: startOfCurrentMonth } } }),
    db.order.count({ where: { status: { notIn: ["DELIVERED", "CANCELLED"] } } }),
    db.order.count({ where: { status: "PENDING" } }),
    db.order.aggregate({
      _sum: { totalAmount: true },
      where: { 
        createdAt: { gte: startOfCurrentMonth },
        status: { not: "CANCELLED" }
      }
    }),
    db.order.aggregate({
      _sum: { totalAmount: true },
      where: { 
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        status: { not: "CANCELLED" }
      }
    })
  ])

  const revenueCurrent = Number(currentMonthRevenue._sum.totalAmount) || 0
  const revenueLast = Number(lastMonthRevenue._sum.totalAmount) || 0
  
  // Calculate percentage change for revenue
  const revenueChange = revenueLast === 0 
    ? (revenueCurrent > 0 ? 100 : 0) 
    : ((revenueCurrent - revenueLast) / revenueLast) * 100

  return {
    totalProducts: { value: totalProducts, change: newProductsThisMonth },
    totalClients: { value: totalClients, change: newClientsThisMonth },
    activeOrders: { value: activeOrders, pending: pendingOrders },
    monthlyRevenue: { value: revenueCurrent, change: revenueChange }
  }
}

export async function getDashboardCharts() {
  // Revenue Trend (Last 7 months)
  const months = Array.from({ length: 7 }, (_, i) => {
    const d = subMonths(new Date(), 6 - i)
    return {
      date: d,
      label: format(d, "MMM"),
      key: format(d, "yyyy-MM")
    }
  })

  // We fetch raw data and aggregate in JS for flexibility
  const revenueData = await db.order.findMany({
    where: {
      status: { not: "CANCELLED" },
      createdAt: { gte: startOfMonth(subMonths(new Date(), 6)) }
    },
    select: { createdAt: true, totalAmount: true }
  })

  const revenueTrend = months.map(month => {
    const monthRevenue = revenueData
      .filter(order => format(order.createdAt, "yyyy-MM") === month.key)
      .reduce((sum, order) => sum + Number(order.totalAmount), 0)
    return { name: month.label, total: monthRevenue }
  })

  // Imports vs Exports (Last 7 months)
  const importsData = await db.import.findMany({
      where: { createdAt: { gte: startOfMonth(subMonths(new Date(), 6)) } },
      select: { createdAt: true, quantity: true }
  })
  
  const exportsData = await db.export.findMany({
      where: { createdAt: { gte: startOfMonth(subMonths(new Date(), 6)) } },
      select: { createdAt: true, quantity: true }
  })

  const importExportTrend = months.map(month => {
      const imports = importsData
          .filter(i => format(i.createdAt, "yyyy-MM") === month.key)
          .reduce((sum, i) => sum + i.quantity, 0)
      const exports = exportsData
          .filter(e => format(e.createdAt, "yyyy-MM") === month.key)
          .reduce((sum, e) => sum + e.quantity, 0)
      return { name: month.label, imports, exports }
  })

  // Product Mix
  const products = await db.product.groupBy({
      by: ['type'],
      _count: { id: true }
  })

  // Map readable names and colors? Handled in component usually, just return data here
  const productMix = products.map(p => ({
      name: p.type,
      value: p._count.id
  }))

  return {
    revenueTrend,
    importExportTrend,
    productMix
  }
}

export async function getRecentOrders() {
  const orders = await db.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true } // Assuming 'name' is the client name/company
      }
    }
  })

  return orders.map(order => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customer: order.user?.name || "Unknown",
    amount: Number(order.totalAmount),
    status: order.status
  }))
}

export async function getLowStockProducts() {
  // Fetch products and verify low stock in JS since we can't compare columns in 'where' easily in all Prisma versions/DBs without raw query
  // But actually, we can't easily query "quantity <= minStock" without raw SQL or fetching all.
  // We'll fetch all products that *might* be low stock (e.g., filtering in JS) 
  // For better performance in large DBs, raw query is better. For this app, fetch all products with inventory is likely fine (< 1000 products).
  
  const products = await db.product.findMany({
    include: { inventory: true }
  })

  const lowStock = products
    .filter(p => (p.inventory?.quantity ?? 0) <= p.minStock)
    .map(p => ({
      id: p.id,
      name: p.name,
      current: p.inventory?.quantity ?? 0,
      min: p.minStock,
      image: p.image
    }))
    .slice(0, 5) // Just top 5 for the card

  return lowStock
}
