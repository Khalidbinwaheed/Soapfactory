import { db } from "@/lib/db"
import { InvoiceContent } from "@/components/invoices/invoice-content"
import { PrintButton } from "@/components/invoices/print-button"
import { notFound } from "next/navigation"

interface InvoicePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params
  
  const invoice = await db.invoice.findUnique({
    where: { id },
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

  if (!invoice) return notFound()

  const formattedInvoice = {
      ...invoice,
      amount: invoice.amount.toNumber(),
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
      dueDate: invoice.dueDate?.toISOString() || null,
      paidDate: invoice.paidDate?.toISOString() || null,
      order: {
          ...invoice.order,
          totalAmount: invoice.order.totalAmount.toNumber(),
          subtotal: invoice.order.subtotal.toNumber(),
          tax: invoice.order.tax.toNumber(),
          discount: invoice.order.discount.toNumber(),
          createdAt: invoice.order.createdAt.toISOString(),
          updatedAt: invoice.order.updatedAt.toISOString(),
          user: {
              ...invoice.order.user,
              createdAt: invoice.order.user.createdAt.toISOString(),
              updatedAt: invoice.order.user.updatedAt.toISOString()
          },
          items: invoice.order.items.map(item => ({
              ...item,
              price: item.price.toNumber(),
              product: {
                  ...item.product,
                  price: item.product.price.toNumber(),
                  createdAt: item.product.createdAt.toISOString(),
                  updatedAt: item.product.updatedAt.toISOString(),
                  // Inventory is not included in query, so no need to map
              }
          }))
      }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-end mb-4 print:hidden">
        <PrintButton />
      </div>
      <InvoiceContent invoice={formattedInvoice as any} />
    </div>
  )
}
