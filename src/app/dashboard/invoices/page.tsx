import { db } from "@/lib/db"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Invoice, Order, User, PaymentStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye } from "lucide-react"

type InvoiceWithOrder = Invoice & { order: Order & { user: User } }

const columns: ColumnDef<InvoiceWithOrder>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice #",
  },
  {
    accessorKey: "order.user.name",
    header: "Customer",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(row.original.amount))
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.original.status
         let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
         if (status === PaymentStatus.PAID) variant = "success" as any
         else if (status === PaymentStatus.OVERDUE) variant = "destructive"
         else variant = "secondary"

        return <Badge variant={variant}>{status}</Badge>
    }
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => row.original.dueDate ? new Date(row.original.dueDate).toLocaleDateString() : "-"
  },
  {
    id: "actions",
    cell: ({ row }) => (
        <Button size="sm" variant="ghost" asChild>
            <Link href={`/dashboard/invoices/${row.original.id}`}>
                <Eye className="h-4 w-4" />
            </Link>
        </Button>
    )
  }
]

import { auth } from "@/auth"

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
      <DataTable columns={columns} data={invoices} searchKey="invoiceNumber" />
    </div>
  )
}
