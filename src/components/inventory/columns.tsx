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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Inventory, Product } from "@prisma/client"
import { StockAdjustmentDialog } from "@/components/inventory/stock-adjustment-dialog"
import { useState } from "react"

type InventoryWithProduct = Inventory & { product: Product }

export const columns: ColumnDef<InventoryWithProduct>[] = [
  {
    accessorKey: "product.name",
    header: "Product Name",
  },
  {
    accessorKey: "product.sku",
    header: "SKU",
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
        const qty = row.original.quantity
        const minStock = row.original.product.minStock
        let className = ""
        if (qty === 0) className = "text-red-600 font-bold"
        else if (qty <= minStock) className = "text-yellow-600 font-semibold"
        
        return <div className={className}>{qty} {row.original.product.unit}</div>
    }
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
        const qty = row.original.quantity
        const minStock = row.original.product.minStock
        
        if (qty === 0) return <Badge variant="destructive">Out of Stock</Badge>
        if (qty <= minStock) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low Stock</Badge>
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionCell inventory={row.original} />
    },
  },
]

// Separate component for cell actions to manage state
function ActionCell({ inventory }: { inventory: InventoryWithProduct }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                    Adjust Stock
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
            <StockAdjustmentDialog open={open} onOpenChange={setOpen} inventory={inventory} />
        </>
    )
}
