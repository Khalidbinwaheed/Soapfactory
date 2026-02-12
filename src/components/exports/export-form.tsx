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
import { createExportAction } from "@/actions/exports"
import { useTransition, useState } from "react"
import { Product } from "@prisma/client"

const exportSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be positive"),
  clientId: z.string().optional(),
  notes: z.string().optional(),
})

type ExportFormValues = z.infer<typeof exportSchema>

interface ExportFormProps {
  products: Product[]
  onSuccess?: () => void
}

export function ExportForm({ products, onSuccess }: ExportFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ExportFormValues>({
    resolver: zodResolver(exportSchema) as any,
    defaultValues: {
      productId: "",
      quantity: 1,
      clientId: "",
      notes: ""
    },
  })

  function onSubmit(data: ExportFormValues) {
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
             formData.append(key, value.toString())
        }
      })

      const result = await createExportAction(null, formData)
      
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
              <FormLabel>Product</FormLabel>
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
            name="clientId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Client ID (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="Client ID / Name" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

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
            Register Export
        </Button>
      </form>
    </Form>
  )
}
