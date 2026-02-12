"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
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
import { createOrderAction } from "@/actions/orders"
import { useTransition, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Product, User, OrderStatus } from "@prisma/client"
import { Trash, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Schema checking
const orderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
})

const orderSchema = z.object({
  userId: z.string().min(1, "Customer is required"),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
  tax: z.coerce.number().optional().default(0),
  discount: z.coerce.number().optional().default(0),
})

type OrderFormValues = z.infer<typeof orderSchema>

interface OrderFormProps {
  products: Product[]
  users: User[]
}

export function OrderForm({ products, users }: OrderFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema) as any,
    defaultValues: {
      items: [{ productId: "", quantity: 1, price: 0 }],
      status: OrderStatus.PENDING,
      tax: 0,
      discount: 0,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  // Calculate totals for display
  const items = form.watch("items")
  const tax = form.watch("tax") || 0
  const discount = form.watch("discount") || 0

  const subtotal = items.reduce((acc, item) => {
      return acc + (item.quantity * item.price)
  }, 0)
  const total = subtotal + tax - discount

  // Helper to update price when product changes
  const handleProductChange = (index: number, productId: string) => {
      const product = products.find(p => p.id === productId)
      if (product) {
          form.setValue(`items.${index}.price`, Number(product.price))
      }
      form.setValue(`items.${index}.productId`, productId)
  }

  function onSubmit(data: OrderFormValues) {
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      
      // We need to pass nested data, easier to JSON stringify the items
      formData.append("userId", data.userId)
      formData.append("status", data.status)
      formData.append("tax", data.tax?.toString() || "0")
      formData.append("discount", data.discount?.toString() || "0")
      if (data.notes) formData.append("notes", data.notes)
      
      formData.append("items", JSON.stringify(data.items))

      const result = await createOrderAction(null, formData)
      
      if (result && 'message' in result) {
             setError(result.message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md">
                {error}
            </div>
         )}
        
        <div className="grid gap-6 md:grid-cols-2">
             <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {users.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.email})
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
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Order Status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {Object.values(OrderStatus).map(status => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Order Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: "", quantity: 1, price: 0 })}>
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>
            
            {fields.map((field, index) => (
                <Card key={field.id}>
                    <CardContent className="p-4 grid gap-4 md:grid-cols-4 items-end">
                         <FormField
                            control={form.control}
                            name={`items.${index}.productId`}
                            render={({ field: propField }) => (
                                <FormItem className="col-span-2">
                                <FormLabel>Product</FormLabel>
                                <Select onValueChange={(val) => handleProductChange(index, val)} defaultValue={propField.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Product" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {products.map(product => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {product.name} ({product.sku}) - {Number(product.price).toFixed(2)}
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
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="flex items-center gap-2">
                             <FormField
                                control={form.control}
                                name={`items.${index}.price`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    <FormLabel>Unit Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Order notes..."
                    className="resize-none"
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{subtotal.toFixed(2)}</span>
                </div>
                 <FormField
                    control={form.control}
                    name="tax"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                        <FormLabel className="mr-2">Tax:</FormLabel>
                        <FormControl>
                            <Input type="number" className="w-24 text-right h-8" min="0" step="0.01" {...field} />
                        </FormControl>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                        <FormLabel className="mr-2">Discount:</FormLabel>
                        <FormControl>
                            <Input type="number" className="w-24 text-right h-8" min="0" step="0.01" {...field} />
                        </FormControl>
                        </FormItem>
                    )}
                />
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>{total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <Button type="submit" disabled={isPending} size="lg" className="w-full md:w-auto">
            Create Order
        </Button>
      </form>
    </Form>
  )
}
