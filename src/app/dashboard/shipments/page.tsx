import { getShipments } from "@/actions/shipping"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Shipment, Order, User } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, ExternalLink } from "lucide-react"

type ShipmentWithOrder = Shipment & { order: Order & { user: User } }

const columns: ColumnDef<ShipmentWithOrder>[] = [
    {
        accessorKey: "order.orderNumber",
        header: "Order #",
        cell: ({ row }) => (
            <Link href={`/dashboard/orders/${row.original.orderId}`} className="hover:underline font-medium">
                {row.original.order.orderNumber}
            </Link>
        )
    },
    {
        accessorKey: "order.user.name",
        header: "Customer",
    },
    {
        accessorKey: "carrier",
        header: "Carrier",
        cell: ({ row }) => row.original.carrier || "-",
    },
    {
        accessorKey: "trackingNumber",
        header: "Tracking",
        cell: ({ row }) => row.original.trackingNumber || "-",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge variant="outline">{row.original.status || "Pending"}</Badge>
    },
    {
        accessorKey: "shippedDate",
        header: "Shipped Date",
        cell: ({ row }) => row.original.shippedDate ? new Date(row.original.shippedDate).toLocaleDateString() : "-"
    },
     {
        id: "actions",
        cell: ({ row }) => (
            <Button size="sm" variant="ghost" asChild>
                <Link href={`/dashboard/orders/${row.original.orderId}`}>
                    <ExternalLink className="h-4 w-4" />
                </Link>
            </Button>
        )
      }
]

export default async function ShipmentsPage() {
    const shipments = await getShipments()

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Shipments</h1>
            </div>
            <DataTable columns={columns} data={shipments} searchKey="order.orderNumber" />
        </div>
    )
}
