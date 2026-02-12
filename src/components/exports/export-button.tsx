"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ExportForm } from "@/components/exports/export-form"
import { useState } from "react"
import { ArrowUpFromLine } from "lucide-react"
import { Product } from "@prisma/client"

interface ExportButtonProps {
    products: Product[]
}

export function ExportButton({ products }: ExportButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
             <ArrowUpFromLine className="mr-2 h-4 w-4" /> Export / Stock Out
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Export</DialogTitle>
          <DialogDescription>
            Register outgoing stock to clients.
          </DialogDescription>
        </DialogHeader>
        <ExportForm products={products} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
