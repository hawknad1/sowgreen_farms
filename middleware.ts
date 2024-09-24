import { NextRequest, NextResponse } from "next/server"
import { auth } from "./auth"
import { LOGIN, ROOT } from "./lib/routes"

export default async function middleware(req: NextRequest) {
  let session

  try {
    // Fetch the session using the auth() function
    session = await auth()
  } catch (error) {
    console.error("Error fetching session:", error)
    // If there's an error in fetching session, treat the user as unauthenticated
    return NextResponse.redirect(new URL(LOGIN, req.url))
  }

  const { pathname } = req.nextUrl

  const isAuthenticate = !!session?.user // Check if the session has a user
  const userRole = session?.user?.role // Extract user role from session

  // Admin protected routes
  const adminRoute = pathname.startsWith("/admin")

  // Checkout route
  const checkoutRoute = pathname.startsWith("/checkout")

  // If the user is authenticated and an admin, redirect to /admin
  if (isAuthenticate && userRole === "admin" && pathname === ROOT) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url))
  }

  // If the user is authenticated but a regular user, redirect to root
  if (isAuthenticate && userRole === "user" && pathname === "/admin") {
    return NextResponse.redirect(new URL(ROOT, req.url))
  }

  // Redirect unauthenticated users trying to access checkout
  if (checkoutRoute && !isAuthenticate) {
    return NextResponse.redirect(new URL(LOGIN, req.url))
  }

  // Redirect non-admin users trying to access admin routes
  if (adminRoute && (!isAuthenticate || userRole !== "admin")) {
    return NextResponse.redirect(new URL(ROOT, req.url))
  }

  // Allow the request to proceed
  return NextResponse.next()
}

// Apply middleware only to specific routes
export const config = {
  matcher: ["/admin/:path*", "/checkout", "/"],
}
