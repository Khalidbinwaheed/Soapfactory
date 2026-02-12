import { ShipmentForm } from "@/components/shipping/shipment-form"
import { GenerateInvoiceButton } from "@/components/invoices/generate-invoice-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText } from "lucide-react"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderStatusUpdate } from "@/components/orders/order-status-update"

// ... imports

interface OrderDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailsPage(props: OrderDetailsPageProps) {
  const params = await props.params;
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
        user: true,
        items: {
            include: {
                product: true
            }
        },
        shipment: true,
        invoice: true
    }
  })

  if (!order) {
      notFound()
  }

  // ... (rest)

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
            <div className="flex items-center gap-4">
                {order.invoice ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/invoices/${order.invoice.id}`}>
                             <FileText className="mr-2 h-4 w-4" /> View Invoice
                        </Link>
                    </Button>
                ) : (
                    <GenerateInvoiceButton orderId={order.id} />
                )}
                <span className="text-muted-foreground">Status:</span>
                <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
            </div>
        </div>
        
        {/* ... rest of the page ... */}

        <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-medium">{order.user.name}</div>
                        <div className="text-muted-foreground">{order.user.email}</div>
                        <div className="mt-2">{order.user.phone}</div>
                        <div>{order.user.address}</div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Shipment Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ShipmentForm orderId={order.id} initialData={order.shipment} />
                    </CardContent>
                </Card>
            </div>

            <Card className="h-fit">
                 <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{order.subtotal.toString()}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{order.tax.toString()}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Discount</span>
                        <span>{order.discount.toString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>{order.totalAmount.toString()}</span>
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card>
            {/* ... items table ... */}
            <CardHeader>
                <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Quantity</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Unit Price</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {order.items.map(item => (
                                <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{item.product.name} ({item.product.sku})</td>
                                    <td className="p-4 align-middle">{item.quantity}</td>
                                    <td className="p-4 align-middle">{item.price.toString()}</td>
                                    <td className="p-4 align-middle text-right">{(Number(item.price) * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
