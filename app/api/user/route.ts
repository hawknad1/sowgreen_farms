import { auth } from "@/auth"
import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

// Force dynamic rendering
export const dynamic = "force-dynamic"

// export async function GET(req: Request) {
//   try {
//     const users = await prisma.user.findMany({
//       include: {
//         customer: true,
//         orders: {
//           include: { shippingAddress: true },
//         },
//       },
//     })

//     return NextResponse.json(users, {
//       status: 200,
//       headers: {
//         "Cache-Control": "no-store, must-revalidate",
//       },
//     })
//   } catch (error) {
//     console.log(error)
//     return NextResponse.json(
//       { message: "Couldn't fetch users" },
//       { status: 500 }
//     )
//   }
// }

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - You must be logged in" },
        { status: 401 }
      )
    }

    // 2. Check user role (if you have admin/users distinction)
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email },
    })

    if (user?.role !== "admin") {
      // Add this if you want admin-only access
      return NextResponse.json(
        { error: "Forbidden - You don't have permission" },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
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

    return NextResponse.json(users, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Couldn't fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { name, address, city, country, dateOfBirth, phone } =
      await req.json()

    const user = await prisma.user.create({
      data: {
        name,
        address,
        city,
        country,
        dateOfBirth,
        phone,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    )
  }
}

// export async function POST(req: Request) {
// }
