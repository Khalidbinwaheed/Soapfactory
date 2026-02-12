import { BatchForm } from "@/components/batches/batch-form"
import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'

export default async function NewBatchPage() {
  const products = await db.product.findMany({
      orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Create Batch</h3>
        <p className="text-sm text-muted-foreground">
          Register a new production batch.
        </p>
      </div>
      <BatchForm products={products} />
    </div>
  )
}
