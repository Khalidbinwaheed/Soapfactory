import { ProductForm } from "@/components/products/product-form"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface ProductEditPageProps {
  params: {
    id: string
  }
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const product = await db.product.findUnique({
    where: {
      id: params.id
    }
  })

  if (!product) {
    notFound()
  }

  // Transform decimals/dates if needed, form expects specific types.
  // Prisma Decimal -> number
  const formattedProduct = {
    ...product,
    price: parseFloat(product.price.toString()),
    // Handling nulls
    category: product.category || undefined,
    weight: product.weight || undefined,
    unit: product.unit || "g",
    description: product.description || undefined,
    image: product.image || undefined,
  }

  return (
    <div className="space-y-6">
       <div>
        <h3 className="text-lg font-medium">Edit Product</h3>
        <p className="text-sm text-muted-foreground">
          Update product details.
        </p>
      </div>
      <ProductForm initialData={formattedProduct} />
    </div>
  )
}
