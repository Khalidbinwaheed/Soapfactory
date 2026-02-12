import { getShipments } from "@/actions/shipping"
import { ShipmentsClient } from "@/components/shipments/shipments-client"

export default async function ShipmentsPage() {
    const shipments = await getShipments()

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Shipments</h1>
            </div>
            <ShipmentsClient data={shipments as any} />
        </div>
    )
}
