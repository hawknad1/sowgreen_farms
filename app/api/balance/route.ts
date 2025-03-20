import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, phone, amount } = await req.json()

    // Validate input
    if ((!email && !phone) || typeof amount !== "number" || amount <= 0) {
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
        balance: {
          increment: amount,
        },
      },
    })

    // Respond with success message and updated user data
    return NextResponse.json(
      { message: "Balance updated successfully", user: updatedUser },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating balance:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

// export async function PUT(req: Request) {
//   try {
//     const { updatedBalance, email, phone } = await req.json()

//     if ((!email && !phone) || typeof updatedBalance !== "number") {
//       return NextResponse.json({ message: "Invalid input" }, { status: 400 })
//     }

//     // Find the user by email or phone
//     const user = await prisma.user.findFirst({
//       where: {
//         OR: [{ email: email ?? undefined }, { phone: phone ?? undefined }],
//       },
//     })

//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 })
//     }

//     // Update the user's balance
//     const updatedUser = await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         balance: parseFloat(updatedBalance.toFixed(2)),
//       },
//     })

//     return NextResponse.json(
//       { message: "Balance updated successfully", user: updatedUser },
//       { status: 200 }
//     )
//   } catch (error) {
//     console.error("Error updating balance:", error)
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }

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
