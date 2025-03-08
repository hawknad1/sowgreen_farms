import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const customer = await prisma.customer.findMany({
      include: { orders: true, shippingAddresses: true, user: true },
    })
    return NextResponse.json(customer, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Couldnt fetch customers!" })
  }
}

export async function POST(req: Request) {
  try {
    const { email, userId, shippingAddresses } = await req.json()

    // Create the customer
    const customer = await prisma.customer.create({
      data: {
        email,
        userId,
        shippingAddresses: {
          create: shippingAddresses, // Create associated shipping addresses
        },
      },
      include: {
        shippingAddresses: true, // Include shipping addresses in the response
        orders: true,
        user: true,
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Failed to create customer" },
      { status: 500 }
    )
  }
}
