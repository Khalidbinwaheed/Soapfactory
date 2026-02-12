import { db } from "@/lib/db"
import { Product } from "@prisma/client"

export const dynamic = 'force-dynamic'
import { columns } from "@/components/products/columns"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

async function getProducts() {
  const products = await db.product.findMany({
    include: {
      inventory: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return products
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
        <Button asChild>
            <Link href="/dashboard/products/new">
                <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={products} searchKey="name" />
    </div>
  )
}
