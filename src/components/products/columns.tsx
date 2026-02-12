"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Product } from "@prisma/client"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<Product & { inventory?: { quantity: number } | null }>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
        return (
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                    <Box className="h-5 w-5" />
                </div>
                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {row.getValue("name")}
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => <div className="text-gray-500 font-mono text-xs">{row.getValue("sku")}</div>
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
        const type = row.getValue("type") as string
        let variant: "default" | "secondary" | "outline" | "destructive" = "secondary"
        let className = "bg-gray-100 text-gray-600 hover:bg-gray-100"

        if (type === "HERBAL") {
            className = "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200"
            variant = "outline"
        } else if (type === "ORGANIC") {
            className = "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
            variant = "outline"
        } else if (type === "BAR") {
             className = "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200"
             variant = "outline"
        }

        return (
            <Badge variant={variant} className={`rounded-full px-3 py-0.5 font-normal ${className}`}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
            </Badge>
        )
    }
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount).replace("PKR", "Rs")
 
      return <div className="font-semibold text-gray-900 dark:text-gray-100">{formatted}</div>
    },
  },
  {
    id: "stock",
    header: "Stock",
    cell: ({ row }) => {
        const quantity = row.original.inventory?.quantity || 0
        const minStock = row.original.minStock
        const isLow = quantity <= minStock

        return (
            <div className="flex items-center gap-2">
                <span className={isLow ? "text-red-600 font-bold" : "text-gray-600"}>
                    {quantity}
                </span>
                {isLow && (
                    <span className="text-[10px] font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        Low
                    </span>
                )}
            </div>
        )
    }
  },
  {
    accessorKey: "weight",
    header: "Weight",
    cell: ({ row }) => {
        const weight = row.original.weight || 0
        const unit = row.original.unit || "g"
        return <div className="text-gray-500">{weight}{unit}</div>
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original
 
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
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copy Product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={`/dashboard/products/${product.id}`}>Edit Product</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
                Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
