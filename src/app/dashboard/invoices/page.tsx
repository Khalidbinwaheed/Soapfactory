import { db } from "@/lib/db"
import { auth } from "@/auth"
import { InvoicesClient } from "@/components/invoices/invoices-client"

export const dynamic = 'force-dynamic'

async function getInvoices() {
    const session = await auth()
    const user = session?.user
    if (!user) return []

    const whereClause: any = {}
    if (user.role === 'CLIENT') {
        whereClause.order = { userId: user.id }
    }

    const invoices = await db.invoice.findMany({
        where: whereClause,
        include: {
            order: {
                include: { user: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
    })

    return invoices.map(invoice => ({
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
            }
        }
    }))
}

export default async function InvoicesPage() {
  const invoices = await getInvoices()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Invoices</h1>
      </div>
      <InvoicesClient data={invoices as any} />
    </div>
  )
}
