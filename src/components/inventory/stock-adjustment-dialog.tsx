"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useState, useTransition } from "react"
import { adjustStockAction } from "@/actions/inventory"
import { Inventory, Product } from "@prisma/client"

interface StockAdjustmentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    inventory: Inventory & { product: Product }
}

export function StockAdjustmentDialog({ open, onOpenChange, inventory }: StockAdjustmentDialogProps) {
  const [type, setType] = useState<"ADD" | "REMOVE" | "SET">("ADD")
  const [quantity, setQuantity] = useState<string>("")
  const [reason, setReason] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!quantity || isNaN(Number(quantity))) {
        setError("Please enter a valid quantity")
        return
    }

    startTransition(async () => {
        const formData = new FormData()
        formData.append("id", inventory.id)
        formData.append("quantity", quantity)
        formData.append("type", type)
        formData.append("reason", reason)

        const result = await adjustStockAction(null, formData)
        
        if (result?.message && !result.success) {
            setError(result.message)
        } else {
            onOpenChange(false)
            setQuantity("")
            setReason("")
        }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>
            Update inventory level for {inventory.product.name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <RadioGroup defaultValue="ADD" onValueChange={(v) => setType(v as any)} className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="ADD" id="add" className="peer sr-only" />
              <Label
                htmlFor="add"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Add
              </Label>
            </div>
            <div>
              <RadioGroupItem value="REMOVE" id="remove" className="peer sr-only" />
              <Label
                htmlFor="remove"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Remove
              </Label>
            </div>
             <div>
              <RadioGroupItem value="SET" id="set" className="peer sr-only" />
              <Label
                htmlFor="set"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Set
              </Label>
            </div>
          </RadioGroup>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Reason
            </Label>
            <Textarea
              id="reason"
              placeholder="e.g. Broken stock, Founder's stash"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
