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
      include: {
        orders: {
          include: { shippingAddress: true, products: true },
        },
      },
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

export async function PUT(req: Request) {
  try {
    const { updatedBalance, email, phone } = await req.json()

    if ((!email && !phone) || typeof updatedBalance !== "number") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 })
    }

    // Find the user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email ?? undefined }, { phone: phone ?? undefined }],
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Update the user's balance
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        balance: parseFloat(updatedBalance.toFixed(2)),
      },
    })

    return NextResponse.json(
      { message: "Balance updated successfully", user: updatedUser },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0", // Disable caching
        },
      }
    )
  } catch (error) {
    console.error("Error updating balance:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
