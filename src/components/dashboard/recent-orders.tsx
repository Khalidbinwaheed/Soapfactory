import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { formatCurrency } from "@/lib/format"

interface RecentOrdersProps {
  orders: {
    id: string
    orderNumber: string
    customer: string
    amount: number
    status: string
  }[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {

  const getStatusColor = (status: string) => {
      switch (status) {
          case 'SHIPPED': return 'bg-gray-200 text-gray-800'
          case 'IN_PRODUCTION': return 'bg-orange-100 text-orange-800'
          case 'DELIVERED': return 'bg-green-100 text-green-800'
          case 'PENDING': return 'bg-yellow-100 text-yellow-800'
          case 'APPROVED': return 'bg-blue-100 text-blue-800'
          default: return 'bg-gray-100 text-gray-800'
      }
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-sm">{order.orderNumber}</span>
                <span className="text-sm text-gray-500">{order.customer}</span>
              </div>
              <div className="flex items-center space-x-4">
                 <span className="font-bold text-sm">{formatCurrency(order.amount)}</span>
                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                     {order.status.replace('_', ' ')}
                 </span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                  No recent orders found.
              </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
