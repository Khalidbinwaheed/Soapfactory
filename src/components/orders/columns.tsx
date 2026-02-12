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

export const columns: ColumnDef<OrderWithUser>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order #",
  },
  {
    accessorKey: "user.name",
    header: "Customer",
    cell: ({ row }) => {
        const user = row.original.user
        return (
            <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
        )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
      
      switch (status) {
        case OrderStatus.PENDING: variant = "secondary"; break;
        case OrderStatus.APPROVED: variant = "info" as any; break; // Check badge variants
        case OrderStatus.IN_PRODUCTION: variant = "default"; break;
        case OrderStatus.READY: variant = "default"; break;
        case OrderStatus.SHIPPED: variant = "success" as any; break;
        case OrderStatus.DELIVERED: variant = "success" as any; break;
        case OrderStatus.CANCELLED: variant = "destructive"; break;
      }
      return <Badge variant={variant}>{status}</Badge>
    }
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
     cell: ({ row }) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(row.original.totalAmount))
    }
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
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
