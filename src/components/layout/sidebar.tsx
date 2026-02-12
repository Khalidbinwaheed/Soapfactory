"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Truck,
  FileText,
  Users,
  Settings,
  Menu,
  LogOut,
  Bell,
  ArrowRightLeft
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Products",
      icon: Package,
      href: "/dashboard/products",
      active: pathname.startsWith("/dashboard/products"),
    },
    {
      label: "Batches",
      icon: Layers,
      href: "/dashboard/batches",
      active: pathname.startsWith("/dashboard/batches"),
    },
    {
      label: "Inventory",
      icon: ArrowRightLeft,
      href: "/dashboard/inventory",
      active: pathname.startsWith("/dashboard/inventory"),
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      href: "/dashboard/orders",
      active: pathname.startsWith("/dashboard/orders"),
    },
    {
      label: "Shipments",
      icon: Truck,
      href: "/dashboard/shipments",
      active: pathname.startsWith("/dashboard/shipments"),
    },
    {
      label: "Invoices",
      icon: FileText,
      href: "/dashboard/invoices",
      active: pathname.startsWith("/dashboard/invoices"),
    },
    // Admin only routes
    ...(role === "SUPER_ADMIN" || role === "ADMIN" || role === "MANAGER" ? [
       {
        label: "Clients",
        icon: Users,
        href: "/dashboard/clients",
        active: pathname.startsWith("/dashboard/clients"),
      },
    ] : []),
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname.startsWith("/dashboard/settings"),
    },
  ]

  return (
    <div className={cn("pb-12 bg-muted/40 border-r min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Soap Factory ERP
          </h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 py-2 mt-auto absolute bottom-4 w-full">
         <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
         </Button>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-muted/40">
        <Sidebar className="w-full border-r-0" />
      </SheetContent>
    </Sheet>
  )
}
