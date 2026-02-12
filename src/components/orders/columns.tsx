"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Order, OrderStatus, User } from "@prisma/client"

type OrderWithUser = Order & { user: User }

const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
    APPROVED: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
    IN_PRODUCTION: "bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200",
    READY: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100 border-cyan-200",
    SHIPPED: "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200",
    DELIVERED: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
}

export const columns: ColumnDef<OrderWithUser>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order #",
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("orderNumber")}</span>
  },
  {
    accessorKey: "user.name",
    header: "Customer",
    cell: ({ row }) => {
        const user = row.original.user
        return (
            <div className="flex flex-col">
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{user.name}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
            </div>
        )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as keyof typeof statusStyles
      const className = statusStyles[status] || "bg-gray-100 text-gray-800"
      
      return (
        <Badge variant="outline" className={`rounded-md px-2.5 py-0.5 font-medium border-0 ring-1 ring-inset ${className}`}>
           {status.replace('_', ' ')}
        </Badge>
      )
    }
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
     cell: ({ row }) => {
        const formatted = new Intl.NumberFormat('en-PK', { 
            style: 'currency', 
            currency: 'PKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Number(row.original.totalAmount)).replace('PKR', 'Rs')
        
        return <div className="font-semibold">{formatted}</div>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
        <span className="text-gray-500 text-sm">
            {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
    )
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={`/dashboard/orders/${order.id}`}>View Details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
