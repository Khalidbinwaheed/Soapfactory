import { db } from "@/lib/db"
import { Product } from "@prisma/client"

export const dynamic = 'force-dynamic'
import { columns } from "@/components/products/columns"
import { ProductsDataTable } from "@/components/products/products-data-table"
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
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight font-serif">Products</h1>
           <p className="text-sm text-muted-foreground mt-1">
             {products.length} products in catalog
           </p>
        </div>
        
        <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm">
            <Link href="/dashboard/products/new">
                <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
        </Button>
      </div>
      
      <ProductsDataTable columns={columns} data={products} />
    </div>
  )
}
