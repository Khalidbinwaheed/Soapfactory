import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = nextUrl.pathname === "/" || nextUrl.pathname === "/login"
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard")

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  if (isDashboardRoute && !isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
  }

  if (isLoggedIn && nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }
  
  // Role based protection
  if (isDashboardRoute && isLoggedIn) {
      const role = req.auth?.user?.role
      
      // Client Restrictions
      if (role === "CLIENT") {
          // Clients cannot access /batches, /inventory, /imports, /exports, /clients (the user management page)
          // Shipments, Invoices, Orders, Products are allowed (Products view only ideally, but dashboard/products page might be management view)
          // Wait, Products page is management list usually. Client view should be separate or conditional.
          // For now, let's block strict admin/manager routes.
          
          const adminRoutes = [
              "/dashboard/batches",
              "/dashboard/inventory", 
              "/dashboard/imports",
              "/dashboard/exports",
              "/dashboard/clients"
          ]
          
          if (adminRoutes.some(route => nextUrl.pathname.startsWith(route))) {
               return NextResponse.redirect(new URL("/dashboard", nextUrl)) // Redirect to main dashboard
          }
      }
      
      // Manager Restrictions (Can do most things except maybe User Management?)
      if (role === "MANAGER") {
           // Maybe only Admin can manage Clients/Users? The prompt says "Admins/Managers can...".
           // But Super Admin for Role management.
           // Managing Clients is fine for Manager.
      }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
