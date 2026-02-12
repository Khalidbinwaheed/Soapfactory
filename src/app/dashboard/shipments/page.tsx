import { getShipments } from "@/actions/shipping"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/shipments/columns" // Import strictly typed columns

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
