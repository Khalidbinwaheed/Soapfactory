import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PaymentStatus } from "@prisma/client"

interface InvoicePageProps {
  params: {
    id: string
  }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const invoice = await db.invoice.findUnique({
    where: { id: params.id },
    include: {
      order: {
        include: {
          user: true,
          items: {
            include: {
              product: true
            }
          }
        }
      }
    }
  })

  if (!invoice) {
    notFound()
  }

  const { order } = invoice

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8 bg-white text-black shadow-lg rounded-lg print:shadow-none print:p-0">
      <div className="flex justify-between items-start print:hidden">
        <Button variant="outline" onClick="window.print()" className="print-button">
            <Printer className="mr-2 h-4 w-4" /> Print Invoice
        </Button>
      </div>

      <div className="flex justify-between items-start border-b pb-8">
        <div>
          <h1 className="text-3xl font-bold">INVOICE</h1>
          <div className="text-muted-foreground mt-2">
            <p className="font-semibold text-black">Soap Factory Inc.</p>
            <p>123 Soap Lane</p>
            <p>Clean City, SC 12345</p>
          </div>
        </div>
        <div className="text-right">
           <h2 className="text-xl font-bold text-gray-700">#{invoice.invoiceNumber}</h2>
           <div className="mt-2 space-y-1 text-sm">
             <div className="flex justify-between gap-8">
                <span className="text-muted-foreground">Date:</span>
                <span>{new Date(invoice.createdAt).toLocaleDateString()}</span>
             </div>
              <div className="flex justify-between gap-8">
                <span className="text-muted-foreground">Due Date:</span>
                <span>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</span>
             </div>
             <div className="flex justify-between gap-8">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold uppercase">{invoice.status}</span>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 pb-8 border-b">
         <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Bill To:</h3>
            <p className="font-bold">{order.user.name}</p>
            <p className="text-sm">{order.user.address}</p>
            <p className="text-sm">{order.user.email}</p>
         </div>
      </div>

      <div>
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b">
                     <th className="text-left py-3">Item</th>
                     <th className="text-right py-3">Quantity</th>
                     <th className="text-right py-3">Price</th>
                     <th className="text-right py-3">Total</th>
                </tr>
            </thead>
            <tbody>
                {order.items.map(item => (
                    <tr key={item.id} className="border-b">
                        <td className="py-3">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">{item.product.sku}</p>
                        </td>
                        <td className="text-right py-3">{item.quantity}</td>
                        <td className="text-right py-3">{Number(item.price).toFixed(2)}</td>
                        <td className="text-right py-3">{(Number(item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-4">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{Number(order.subtotal).toFixed(2)}</span>
            </div>
             <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>{Number(order.tax).toFixed(2)}</span>
            </div>
             <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span>-{Number(order.discount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{Number(invoice.amount).toFixed(2)}</span>
            </div>
          </div>
      </div>
      
      <div className="pt-8 text-center text-sm text-muted-foreground print:landscape">
        <p>Thank you for your business!</p>
      </div>
    </div>
  )
}
