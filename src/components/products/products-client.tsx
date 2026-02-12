"use client"

import { ProductsDataTable } from "@/components/products/products-data-table"
import { columns } from "@/components/products/columns"
import { Product } from "@prisma/client"

type ProductWithInventory = Product & { inventory: { quantity: number } | null }

interface ProductsClientProps {
  data: ProductWithInventory[]
}

export function ProductsClient({ data }: ProductsClientProps) {
  return <ProductsDataTable columns={columns as any} data={data} />
}
