"use client"

import { Button } from "@/components/ui/button"
import { createInvoiceAction } from "@/actions/invoices"
import { useTransition } from "react"
import { toast } from "sonner" // Or alert
import { FileText } from "lucide-react"

interface GenerateInvoiceButtonProps {
    orderId: string
    disabled?: boolean
}

export function GenerateInvoiceButton({ orderId, disabled }: GenerateInvoiceButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleClick = () => {
        startTransition(async () => {
            const result = await createInvoiceAction(orderId)
            if (result.success) {
                // Success
            } else {
                alert(result.message)
            }
        })
    }

    return (
        <Button variant="outline" size="sm" onClick={handleClick} disabled={disabled || isPending}>
            <FileText className="mr-2 h-4 w-4" />
            {isPending ? "Generating..." : "Generate Invoice"}
        </Button>
    )
}
