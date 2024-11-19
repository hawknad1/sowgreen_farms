import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userEmail = params.id

    // Fetch shipping addresses with associated orders
    const shippingAddresses = await prisma.shippingAddress.findMany({
      where: {
        email: userEmail,
        orders: { some: {} }, // Ensures only addresses with orders are included
      },
      include: {
        orders: {
          include: { shippingAddress: true },
        }, // Include orders for the shipping addresses
      },
    })

    if (shippingAddresses.length === 0) {
      return NextResponse.json({ message: "No orders found for this user" })
    }

    return NextResponse.json(shippingAddresses)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { message: "Couldn't fetch orders!" },
      { status: 500 }
    )
  }
}
