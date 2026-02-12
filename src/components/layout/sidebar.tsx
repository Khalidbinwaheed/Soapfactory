"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button" // Removed unused Button
// import { ScrollArea } from "@/components/ui/scroll-area" // Removed unused ScrollArea
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutGrid, // Dashboard
  Package, // Products
  FlaskConical, // Batches
  Warehouse, // Inventory
  Download, // Imports
  Upload, // Exports
  ShoppingCart, // Orders
  Truck, // Shipments
  FileText, // Invoices
  Bell, // Notifications
  Settings, // Settings
  ChevronLeft, // Collapse
  Sparkles, // Logo
  Menu, // Mobile menu
  Users // Clients
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button" // Re-added for MobileSidebar

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutGrid,
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
      icon: FlaskConical,
      href: "/dashboard/batches",
      active: pathname.startsWith("/dashboard/batches"),
    },
    {
      label: "Inventory",
      icon: Warehouse,
      href: "/dashboard/inventory",
      active: pathname.startsWith("/dashboard/inventory"),
    },
    {
      label: "Imports",
      icon: Download,
      href: "/dashboard/imports",
      active: pathname.startsWith("/dashboard/imports"),
    },
    {
      label: "Exports",
      icon: Upload,
      href: "/dashboard/exports",
      active: pathname.startsWith("/dashboard/exports"),
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
      label: "Notifications",
      icon: Bell,
      href: "/dashboard/notifications",
      active: pathname.startsWith("/dashboard/notifications"),
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname.startsWith("/dashboard/settings"),
    },
  ]

  return (
    <div className={cn("flex flex-col h-full bg-[#111827] text-gray-300", className)}>
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
            <Sparkles className="h-6 w-6 fill-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white leading-none font-serif tracking-wide">
              SoapFactory
            </h1>
            <span className="text-xs text-gray-500 mt-1 font-medium">
              ERP System
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <nav className="space-y-1.5">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                route.active
                  ? "bg-[#1f2937] text-white shadow-sm ring-1 ring-white/10"
                  : "text-gray-400 hover:bg-[#1f2937]/50 hover:text-gray-200"
              )}
            >
              <route.icon className={cn("h-5 w-5", route.active ? "text-orange-500" : "text-gray-500 group-hover:text-gray-400")} />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer / Collapse */}
      <div className="p-4 border-t border-gray-800">
        <button 
            onClick={() => signOut()}
            className="flex w-full items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-[#1f2937] hover:text-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
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
      <SheetContent side="left" className="p-0 bg-[#111827] w-[280px]">
        <Sidebar className="w-full border-r-0" />
      </SheetContent>
    </Sheet>
  )
}
