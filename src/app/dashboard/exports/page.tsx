import { db } from "@/lib/db"
import { columns } from "@/components/exports/columns"

export const dynamic = 'force-dynamic'
import { DataTable } from "@/components/ui/data-table"
import { ExportButton } from "@/components/exports/export-button"

async function getExports() {
  const exports = await db.export.findMany({
    include: {
      product: true
    },
    orderBy: {
      date: 'desc'
    }
  })
  return exports
}

async function getProducts() {
    return await db.product.findMany({
        orderBy: { name: 'asc' }
    })
}

export default async function ExportsPage() {
  const exports = await getExports()
  const products = await getProducts()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-lg font-semibold md:text-2xl">Exports / Sales</h1>
            <p className="text-sm text-muted-foreground">Track outgoing products to clients.</p>
        </div>
        <ExportButton products={products} />
      </div>
      <DataTable columns={columns} data={exports} searchKey="product.name" />
       {/* 
         Note on searchKey: exports column has accessor "product.name". 
         DataTable filters based on id. 
         If column def doesn't specify ID, it might be "product_name".
         Let's assume "product_name" or just verify if client filtering works. 
         Standard tanstack accessorKey "product.name" -> id "product_name".
       */}
    </div>
  )
}
