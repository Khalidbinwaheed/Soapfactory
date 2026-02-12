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
import { ImportForm } from "@/components/imports/import-form"
import { useState } from "react"
import { ArrowDownToLine } from "lucide-react"
import { Product } from "@prisma/client"

interface ImportButtonProps {
    products: Product[]
}

export function ImportButton({ products }: ImportButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            <ArrowDownToLine className="mr-2 h-4 w-4" /> Import / Stock In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Import</DialogTitle>
          <DialogDescription>
            Register incoming stock or materials.
          </DialogDescription>
        </DialogHeader>
        <ImportForm products={products} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
