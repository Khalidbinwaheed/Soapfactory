import { db } from "@/lib/db"
import { columns } from "@/components/batches/columns"

export const dynamic = 'force-dynamic'
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

async function getBatches() {
  const batches = await db.batch.findMany({
    include: {
      product: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return batches
}

export default async function BatchesPage() {
  const batches = await getBatches()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Batches</h1>
        <Button asChild>
            <Link href="/dashboard/batches/new">
                <Plus className="mr-2 h-4 w-4" /> Create Batch
            </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={batches} searchKey="batchCode" />
    </div>
  )
}
