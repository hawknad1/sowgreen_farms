import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const email = params.id

  try {
    const { newEmail, phone, name, address, city, country, dateOfBirth } =
      await req.json()

    // Find the user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Update the user's balance
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        address,
        email: newEmail,
        phone,
        city,
        country,
        dateOfBirth,
      },
    })

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0", // Disable caching
        },
      }
    )
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
