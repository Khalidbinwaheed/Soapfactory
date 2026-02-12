"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createImportAction } from "@/actions/imports"
import { useTransition, useState } from "react"
import { Product } from "@prisma/client"

const importSchema = z.object({
  materialName: z.string().optional(),
  supplier: z.string().min(1, "Supplier is required"),
  productId: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantity must be positive"),
  unit: z.string().default("unit"),
  cost: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
})

type ImportFormValues = z.infer<typeof importSchema>

interface ImportFormProps {
  products: Product[]
  onSuccess?: () => void
}

export function ImportForm({ products, onSuccess }: ImportFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ImportFormValues>({
    resolver: zodResolver(importSchema) as any,
    defaultValues: {
      materialName: "",
      supplier: "",
      quantity: 1,
      unit: "kg",
      cost: 0,
      notes: ""
    },
  })

  function onSubmit(data: ImportFormValues) {
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
             formData.append(key, value.toString())
        }
      })

      const result = await createImportAction(null, formData)
      
      if (result && 'message' in result) {
            setError(result.message)
      } else {
            form.reset()
            onSuccess?.()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                {error}
            </div>
         )}
        
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product (Optional - Updates Inventory)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name="materialName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Material Name (If not product)</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. Raw Material X" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

         <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Supplier</FormLabel>
                <FormControl>
                    <Input placeholder="Supplier Name" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

        <div className="grid grid-cols-2 gap-4">
             <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
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
                    <Input placeholder="kg, pcs, etc." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cost (Optional)</FormLabel>
                <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
            Register Import
        </Button>
      </form>
    </Form>
  )
}
