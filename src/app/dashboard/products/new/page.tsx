import { ProductForm } from "@/components/products/product-form"

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Create Product</h3>
        <p className="text-sm text-muted-foreground">
          Add a new soap product to your catalog.
        </p>
      </div>
      <ProductForm />
    </div>
  )
}
