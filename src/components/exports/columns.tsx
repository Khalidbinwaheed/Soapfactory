"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Export, Product } from "@prisma/client"

type ExportWithProduct = Export & { product: Product }

export const columns: ColumnDef<ExportWithProduct>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
        return new Date(row.original.date).toLocaleDateString()
    }
  },
  {
    accessorKey: "product.name",
    header: "Product",
    cell: ({ row }) => `${row.original.product.name} (${row.original.product.sku})`
  },
  {
    accessorKey: "clientId",
    header: "Client",
    cell: ({ row }) => row.original.clientId || "-"
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => `${row.original.quantity}`
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
]
