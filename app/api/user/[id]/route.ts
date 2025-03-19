import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userEmail = params.id

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      include:{
        orders: true
      }
    })

    // If user is not found, return a 404 response
    if (!user) {
      return NextResponse.json({ message: "No user found" }, { status: 404 })
    }

    // If found, return the user data
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { message: "Could not find user" },
      { status: 500 }
    )
  }
}
