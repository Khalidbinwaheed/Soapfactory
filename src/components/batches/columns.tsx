"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Batch, BatchStatus, Product } from "@prisma/client"

// Helper type including relation
type BatchWithProduct = Batch & { product: Product }

export const columns: ColumnDef<BatchWithProduct>[] = [
  {
    accessorKey: "batchCode",
    header: "Batch Code",
  },
  {
    accessorKey: "product.name",
    header: "Product",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
      
      switch (status) {
        case BatchStatus.PLANNED:
            variant = "secondary"
            break
        case BatchStatus.PRODUCING:
            variant = "default" // Blueish usually
            break
        case BatchStatus.READY:
            variant = "default" // Greenish in custom theme maybe
            break
         case BatchStatus.SOLD:
            variant = "secondary"
            break
      }

      return <Badge variant={variant}>{status}</Badge>
    }
  },
  {
    accessorKey: "manufactureDate",
    header: "Mfg Date",
    cell: ({ row }) => {
        const date = row.original.manufactureDate
        if (!date) return "-"
        return new Date(date).toLocaleDateString()
    }
  },
    {
    accessorKey: "expiryDate",
    header: "Exp Date",
    cell: ({ row }) => {
        const date = row.original.expiryDate
        if (!date) return "-"
        return new Date(date).toLocaleDateString()
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const batch = row.original
 
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
              onClick={() => navigator.clipboard.writeText(batch.id)}
            >
              Copy Batch ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={`/dashboard/batches/${batch.id}`}>Edit Batch</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
