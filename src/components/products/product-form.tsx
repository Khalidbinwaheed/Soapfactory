"use client"

import { createProductAction, updateProductAction } from "@/actions/products"
import { useTransition, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// Define a local type if Prisma import fails, or use any for initialData
type ProductData = {
    id: string
    name: string
    sku: string
    price: number | string | any // Keep flexible for Prisma Decimal
    weight: number | null | any
    unit: string | null
    type: "BAR" | "LIQUID" | "ORGANIC" | "HERBAL" | any // Prisma enum
    minStock: number | any
    description: string | null
    image: string | null
    availableStock?: number
    createdAt?: string | Date
    updatedAt?: string | Date
}

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  weight: z.coerce.number().optional().default(0),
  unit: z.string().optional().default("g"),
  type: z.enum(["BAR", "LIQUID", "ORGANIC", "HERBAL"]),
  minStock: z.coerce.number().int().min(0).default(10),
  description: z.string().optional().default(""),
  image: z.string().optional().default("")
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: ProductData | null
}

export function ProductForm({ initialData }: ProductFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    console.log("ProductForm Initialized - Version 2.0");
    // alert("Product Form Updated Successfully!");
  }, []);
  
  // Use a more specific type for defaultValues to satisfy Zod
  // Zod with .default() produces required properties in the inferred type.
  const defaultValues: ProductFormValues = {
      name: initialData?.name || "",
      sku: initialData?.sku || "",
      price: initialData?.price ? Number(initialData.price) : 0,
      weight: initialData?.weight ? Number(initialData.weight) : 0,
      unit: initialData?.unit || "g",
      type: (initialData?.type as "BAR" | "LIQUID" | "ORGANIC" | "HERBAL") || "BAR",
      minStock: initialData?.minStock ? Number(initialData.minStock) : 10,
      description: initialData?.description || "",
      image: initialData?.image || ""
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues
  })

  function onSubmit(data: ProductFormValues) {
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
             formData.append(key, value.toString())
        }
      })
      
      let result
      if (initialData?.id) {
        result = await updateProductAction(initialData.id, null, formData)
      } else {
        result = await createProductAction(null, formData)
      }
      
      if (result && 'message' in result) {
         if (result.message && result.message !== "Product deleted") {
             setError(result.message)
         }
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        {/* ... error display ... */}
        {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md">
                {error}
            </div>
         )}
        <div className="text-center py-2 bg-green-500 text-white font-bold rounded-md my-2 animate-pulse">
            !!! PRODUCT FORM UPDATED - VERSION 2.0 !!!
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                    <Input placeholder="Lavender Soap" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
                <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                    <Input placeholder="LAV-001" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        {initialData?.id && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg flex items-center justify-between my-4">
                <div>
                   <p className="text-sm font-medium text-orange-800">Current Available Stock</p>
                   <p className="text-2xl font-bold text-orange-900">{initialData.availableStock || 0} {initialData.unit || 'units'}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-orange-600 italic font-medium underline">Live inventory tracking enabled</p>
                </div>
            </div>
        )}

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-600 font-bold underline">!!! PRODUCT IMAGE (UPLOAD) !!!</FormLabel>
              <FormControl>
                <ImageUpload 
                    value={field.value || ""} 
                    onChange={field.onChange}
                    disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid gap-4 md:grid-cols-2">
             <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                    <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                     <Input placeholder="g, kg, ml..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="BAR">Bar</SelectItem>
                  <SelectItem value="LIQUID">Liquid</SelectItem>
                  <SelectItem value="ORGANIC">Organic</SelectItem>
                  <SelectItem value="HERBAL">Herbal</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="minStock"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Minimum Stock Alert</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Product description..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </Form>
  )
}
