import { db } from "@/lib/db"
import { auth } from "@/auth"
import { InvoicesClient } from "@/components/invoices/invoices-client"

async function getInvoices() {
    const session = await auth()
    const user = session?.user
    if (!user) return []

    const whereClause: any = {}
    if (user.role === 'CLIENT') {
        whereClause.order = { userId: user.id }
    }

    return await db.invoice.findMany({
        where: whereClause,
        include: {
            order: {
                include: { user: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
    })
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
