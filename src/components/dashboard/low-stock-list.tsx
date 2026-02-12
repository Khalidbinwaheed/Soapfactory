import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface LowStockListProps {
  items: {
      id: string
      name: string
      current: number
      min: number
  }[]
}

export function LowStockList({ items }: LowStockListProps) {
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        <CardTitle>Low Stock Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0 border-gray-100 dark:border-gray-800">
                    <span className="text-sm font-medium opacity-90">{item.name}</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                        {item.current}/{item.min}
                    </span>
                </div>
            ))}
             {items.length === 0 && (
              <div className="text-center text-muted-foreground py-8 text-sm">
                  All stock levels are healthy!
              </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
