import { db } from "@/lib/db"
import { columns } from "@/components/imports/columns"

export const dynamic = 'force-dynamic'
import { DataTable } from "@/components/ui/data-table"
import { ImportButton } from "@/components/imports/import-button"

async function getImports() {
  const imports = await db.import.findMany({
    include: {
        product: true
    },
    orderBy: {
      date: 'desc'
    }
  })
  return imports
}

async function getProducts() {
    return await db.product.findMany({
        orderBy: { name: 'asc' }
    })
}

export default async function ImportsPage() {
  const imports = await getImports()
  const products = await getProducts()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-lg font-semibold md:text-2xl">Imports / Purchases</h1>
            <p className="text-sm text-muted-foreground">Track incoming materials and products.</p>
        </div>
        <ImportButton products={products} />
      </div>
      <DataTable columns={columns} data={imports} searchKey="supplier" />
    </div>
  )
}
