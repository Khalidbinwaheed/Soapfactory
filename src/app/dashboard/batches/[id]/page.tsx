import { BatchForm } from "@/components/batches/batch-form"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface BatchEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BatchEditPage(props: BatchEditPageProps) {
  const params = await props.params;
  const batch = await db.batch.findUnique({
    where: {
      id: params.id
    }
  })

  if (!batch) {
    notFound()
  }

  const products = await db.product.findMany({
      orderBy: { name: 'asc' }
  })

  // Format dates for the form (string input)
  const formattedBatch = {
      ...batch,
      manufactureDate: batch.manufactureDate ? batch.manufactureDate.toISOString() : undefined,
      expiryDate: batch.expiryDate ? batch.expiryDate.toISOString() : undefined,
      notes: batch.notes || undefined,
      quantity: batch.initialQty // Map initialQty to quantity
  }

  return (
    <div className="space-y-6">
       <div>
        <h3 className="text-lg font-medium">Edit Batch</h3>
        <p className="text-sm text-muted-foreground">
          Update batch details.
        </p>
      </div>
      <BatchForm initialData={formattedBatch} products={products} />
    </div>
  )
}
