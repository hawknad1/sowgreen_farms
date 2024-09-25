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

  // If the user is authenticated and an admin, always redirect them to /admin/dashboard when they hit root
  if (
    isAuthenticate &&
    userRole === "admin" &&
    pathname === ROOT &&
    !req.cookies.get("adminRedirected")
  ) {
    // Set a cookie to prevent multiple redirects when they want to manually access the root
    const response = NextResponse.redirect(new URL("/admin/dashboard", req.url))
    response.cookies.set("adminRedirected", "true", {
      path: "/",
      maxAge: 60 * 60,
    }) // 1 hour
    return response
  }

  // If the user is authenticated but a regular user, redirect from admin routes
  if (isAuthenticate && userRole === "user" && adminRoute) {
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

  // Allow the request to proceed for admins and regular users at root
  return NextResponse.next()
}

// Apply middleware only to specific routes
export const config = {
  matcher: ["/admin/:path*", "/checkout", "/"],
}
