import { auth } from "@/auth"
import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userEmail = params.id

  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - You must be logged in" },
        { status: 401 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If the current user is not an admin AND is trying to access another user's data
    if (existingUser.role !== "admin" && existingUser.email !== userEmail) {
      // Add this if you want admin-only access
      return NextResponse.json(
        { error: "Forbidden - You don't have permission" },
        { status: 403 }
      )
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      // include: {
      //   orders: {
      //     include: { shippingAddress: true, products: true },
      //   },
      // },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        balance: true,
        phone: true,
        address: true,
        dateOfBirth: true,
        whatsappOptIn: true,
        userWhatsappOptIn: true,
        country: true,
        city: true,
        createdAt: true,
        updatedAt: true,
        customer: {
          select: {
            id: true,
            email: true,
          },
        },
        orders: {
          select: {
            id: true,
            referenceNumber: true,
            orderNumber: true,
            total: true,
            subtotal: true,
            totalDue: true,
            creditAppliedTotal: true,
            balanceApplied: true,
            whatsappOptIn: true,
            updatedOrderTotal: true,
            userWhatsappOptIn: true,
            balanceDeducted: true,
            remainingAmount: true,
            updatedBalance: true,
            creditAppliedDeliveryFee: true,
            status: true,
            dispatchRiderId: true,
            dispatchRider: true,
            shippingAddressId: true,
            deliveryMethod: true,
            deliveryFee: true,
            customerId: true,
            deliveryDate: true,
            cardType: true,
            last4Digits: true,
            paymentMode: true,
            paymentAction: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
            shippingAddress: {
              select: {
                id: true,
                name: true,
                region: true,
                city: true,
                address: true,
                phone: true,
                country: true,
                email: true,
                deliveryMethod: true,
                whatsappOptIn: true,
                customerId: true,
                userId: true,
              },
            },
            products: {
              select: {
                id: true,
                productId: true,
                product: true,
                orderId: true,
                price: true,
                weight: true,
                unit: true,
                quantity: true,
                quantityTotal: true,
                available: true,
              },
            },
          },
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

// export async function POST(req: Request) {
//   const { name, address, city, country, dateOfBirth, phone } = await req.json()
// }
