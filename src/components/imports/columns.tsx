"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Import, Product } from "@prisma/client"

type ImportWithProduct = Import & { product: Product | null }

export const columns: ColumnDef<ImportWithProduct>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
        return new Date(row.original.date).toLocaleDateString()
    }
  },
  {
    id: "item_name",
    header: "Item",
    cell: ({ row }) => {
        const product = row.original.product
        if (product) return `${product.name} (${product.sku})`
        return row.original.materialName || "-"
    }
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => `${row.original.quantity} ${row.original.unit || ''}`
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => {
        const cost = row.original.cost
        if (!cost) return "-"
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(cost))
    }
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
]
