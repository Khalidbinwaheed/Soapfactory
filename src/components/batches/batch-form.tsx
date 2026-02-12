"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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
import { createBatchAction, updateBatchAction } from "@/actions/batches"
import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { BatchStatus, Product } from "@prisma/client"

const batchSchema = z.object({
  batchCode: z.string().min(1, "Batch Code is required"),
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  status: z.nativeEnum(BatchStatus),
  manufactureDate: z.string().optional(), // We use string for date input, convert in action
  expiryDate: z.string().optional(),
  notes: z.string().optional(),
})

type BatchFormValues = z.infer<typeof batchSchema>

interface BatchFormProps {
  initialData?: BatchFormValues & { id?: string }
  products: Product[]
}

export function BatchForm({ initialData, products }: BatchFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema) as any,
    defaultValues: initialData ? {
        ...initialData,
        manufactureDate: initialData.manufactureDate ? new Date(initialData.manufactureDate).toISOString().split('T')[0] : '',
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
        quantity: initialData.quantity || 100,
        notes: initialData.notes || ""
    } : {
        batchCode: "",
        productId: "",
        quantity: 100,
        status: BatchStatus.PLANNED,
        manufactureDate: new Date().toISOString().split('T')[0],
        expiryDate: "",
        notes: ""
    }
  })

  function onSubmit(data: BatchFormValues) {
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
             formData.append(key, value.toString())
        }
      })

      let result
      if (initialData?.id) {
        result = await updateBatchAction(initialData.id, null, formData)
      } else {
        result = await createBatchAction(null, formData)
      }

      if (result && 'message' in result) {
         if (result.message && result.message !== "Batch deleted") {
             setError(result.message)
         }
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md">
                {error}
            </div>
         )}
        <div className="grid gap-4 md:grid-cols-2">
            <FormField
            control={form.control}
            name="batchCode"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Batch Code</FormLabel>
                <FormControl>
                    <Input placeholder="BATCH-001" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
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
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(BatchStatus).map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <FormField
            control={form.control}
            name="manufactureDate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Manufacture Date</FormLabel>
                <FormControl>
                    <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                    <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Batch notes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
            {initialData ? "Update Batch" : "Create Batch"}
        </Button>
      </form>
    </Form>
  )
}
