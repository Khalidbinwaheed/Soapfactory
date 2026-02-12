import { OrderForm } from "@/components/orders/order-form"
import { db } from "@/lib/db"

export default async function NewOrderPage() {
  const products = await db.product.findMany({
      orderBy: { name: 'asc' }
  })
  
  const users = await db.user.findMany({
      orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Create New Order</h3>
        <p className="text-sm text-muted-foreground">
          Manually create a new order.
        </p>
      </div>
      <OrderForm products={products} users={users} />
    </div>
  )
}
