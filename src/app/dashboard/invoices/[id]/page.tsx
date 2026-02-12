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

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-end mb-4 print:hidden">
        <PrintButton />
      </div>
      <InvoiceContent invoice={invoice} />
    </div>
  )
}
