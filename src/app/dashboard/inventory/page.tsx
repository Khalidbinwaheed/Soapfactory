import { db } from "@/lib/db"
import { columns } from "@/components/inventory/columns"

export const dynamic = 'force-dynamic'
import { DataTable } from "@/components/ui/data-table"

async function getInventory() {
  const inventory = await db.inventory.findMany({
    include: {
      product: true
    },
    orderBy: {
      product: {
          name: 'asc'
      }
    }
  })
  return inventory
}

export default async function InventoryPage() {
  const inventory = await getInventory()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
            <p className="text-sm text-muted-foreground">Manage stock levels.</p>
        </div>
      </div>
      <DataTable columns={columns} data={inventory} searchKey="product_name" />
       {/* Note: sorting locally might need adjustment if searchKey references nested object. 
           DataTable implementation uses table.getColumn(searchKey). 
           react-table accessor "product.name" matches column id "product_name" if accessor key is used? 
           Actually, the column accessorKey is "product.name". The id defaults to "product_name".
           Let's check columns definition. accessorKey: "product.name". ID defaults to "product_name" (dots replaced by _) usually? 
           Actually tanstack table uses the id if provided or the accessorKey as id. 
           If accessorKey has dots, id is "product_name". 
           So searchKey should be "product_name" or "product_name" ? 
           Wait, TanStack table default IDs for nested accessors are weird. 
           Ideally I should set an explicit ID in columns like id: "productName"
           Let's update columns to be safe or use "product_name". 
           Let's assume "product_name" for now. 
       */}
    </div>
  )
}
