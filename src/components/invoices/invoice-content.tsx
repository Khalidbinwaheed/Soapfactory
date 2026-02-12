import { Invoice, Order, User, OrderItem, Product } from "@prisma/client"
import { format } from "date-fns"

interface InvoiceContentProps {
  invoice: Invoice & {
    order: Order & {
      user: User
      items: (OrderItem & { product: Product })[]
    }
  }
}

export function InvoiceContent({ invoice }: InvoiceContentProps) {
  return (
    <div className="p-8 bg-white text-black print:p-0" id="invoice-print-area">
      <div className="flex justify-between items-start border-b pb-8 mb-8">
        <div>
           <h1 className="text-4xl font-bold tracking-tight text-gray-900">INVOICE</h1>
           <p className="text-gray-500 mt-2">#{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
            <h2 className="text-xl font-bold text-orange-600">Soap Factory</h2>
            <p className="text-sm text-gray-600">123 Industrial Area</p>
            <p className="text-sm text-gray-600">contact@soapfactory.com</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
            <h3 className="font-semibold text-gray-600 mb-2">Bill To:</h3>
            <p className="font-bold text-gray-900">{invoice.order.user.name}</p>
            <p className="text-gray-600">{invoice.order.user.email}</p>
            <p className="text-gray-600">{invoice.order.user.address || "N/A"}</p>
            <p className="text-gray-600">{invoice.order.user.phone || "N/A"}</p>
        </div>
        <div className="text-right">
             <div className="mb-2">
                <span className="font-semibold text-gray-600">Date: </span>
                <span>{format(new Date(invoice.createdAt), "dd MMM yyyy")}</span>
             </div>
             <div className="mb-2">
                <span className="font-semibold text-gray-600">Due Date: </span>
                <span>{invoice.dueDate ? format(new Date(invoice.dueDate), "dd MMM yyyy") : "N/A"}</span>
             </div>
             <div>
                <span className="font-semibold text-gray-600">Status: </span>
                <span className="uppercase font-bold text-gray-900">{invoice.status}</span>
             </div>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
            <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 font-bold text-gray-600">Item</th>
                <th className="text-center py-3 font-bold text-gray-600">Quantity</th>
                <th className="text-right py-3 font-bold text-gray-600">Price</th>
                <th className="text-right py-3 font-bold text-gray-600">Total</th>
            </tr>
        </thead>
        <tbody>
            {invoice.order.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-4">{item.product.name}</td>
                    <td className="text-center py-4">{item.quantity}</td>
                    <td className="text-right py-4">{Number(item.price).toFixed(2)}</td>
                    <td className="text-right py-4">{(Number(item.price) * item.quantity).toFixed(2)}</td>
                </tr>
            ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
          <div className="w-1/3">
             <div className="flex justify-between py-2 border-b">
                 <span className="text-gray-600">Subtotal</span>
                 <span className="font-medium">{Number(invoice.order.subtotal).toFixed(2)}</span>
             </div>
             <div className="flex justify-between py-2 border-b">
                 <span className="text-gray-600">Tax</span>
                 <span className="font-medium">{Number(invoice.order.tax).toFixed(2)}</span>
             </div>
             <div className="flex justify-between py-2 border-b">
                 <span className="text-gray-600">Discount</span>
                 <span className="font-medium text-red-500">-{Number(invoice.order.discount).toFixed(2)}</span>
             </div>
             <div className="flex justify-between py-4">
                 <span className="text-xl font-bold text-gray-900">Total</span>
                 <span className="text-xl font-bold text-orange-600">{Number(invoice.amount).toFixed(2)}</span>
             </div>
          </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-12 pt-8 border-t">
          <p>Thank you for your business!</p>
      </div>
    </div>
  )
}
