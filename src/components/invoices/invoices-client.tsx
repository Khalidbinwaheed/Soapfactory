"use client"

import { DataTable } from "@/components/ui/data-table"
import { Invoice, Order, User, PaymentStatus } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
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

interface InvoicesClientProps {
  data: InvoiceWithOrder[]
}

export function InvoicesClient({ data }: InvoicesClientProps) {
  return <DataTable columns={columns} data={data} searchKey="invoiceNumber" />
}
