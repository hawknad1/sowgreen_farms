import { auth } from "@/auth"
import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const body = await req.json() // Make sure to await this line
    const { userId, newBalance } = body

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - You must be logged in" },
        { status: 401 }
      )
    }

    // 2. Check user role (if you have admin/users distinction)
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user?.email },
    })

    if (existingUser?.role !== "admin") {
      // Add this if you want admin-only access
      return NextResponse.json(
        { error: "Forbidden - You don't have permission" },
        { status: 403 }
      )
    }

    if (!userId || newBalance === undefined) {
      return NextResponse.json(
        { error: "Missing userId or newBalance" },
        { status: 400 }
      )
    }

    // Update the user's balance in the database
    const user = await prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(
      { message: "Balance updated successfully", user },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating balance:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
