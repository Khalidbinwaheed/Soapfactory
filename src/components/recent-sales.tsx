import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { db } from "@/lib/db"

async function getRecentSales() {
    return await db.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    })
}

export async function RecentSales() {
  const sales = await getRecentSales()

  return (
    <div className="space-y-8">
      {sales.map(sale => (
        <div key={sale.id} className="flex items-center">
            <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{sale.user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.user.name}</p>
            <p className="text-sm text-muted-foreground">
                {sale.user.email}
            </p>
            </div>
            <div className="ml-auto font-medium">
                +{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(sale.totalAmount))}
            </div>
        </div>
      ))}
    </div>
  )
}
