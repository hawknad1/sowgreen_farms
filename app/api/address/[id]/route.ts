import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const identifier = params.id.trim()

    // Determine whether the identifier is an email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)

    // Fetch all shipping addresses with associated orders
    const rawData = await prisma.shippingAddress.findMany({
      where: isEmail
        ? { email: identifier } // Fetch by email
        : { id: identifier }, // Fetch by ID
      include: {
        orders: {
          include: {
            products: true, // Include product details if needed
            shippingAddress: true,
          },
        },
      },
    })

    if (rawData.length === 0) {
      return NextResponse.json(
        { message: "No orders found for this user" },
        { status: 404 }
      )
    }

    // Group all orders under a single `shippingAddress` for the same email
    const consolidatedData = rawData.reduce((acc, curr) => {
      const existingEntry = acc.find((item) => item.email === curr.email)

      if (existingEntry) {
        // Add orders to the existing entry's orders array
        existingEntry.orders = [...existingEntry.orders, ...curr.orders]
      } else {
        // Create a new entry with the current shipping address and orders
        acc.push({
          ...curr,
          orders: [...curr.orders], // Initialize with current orders
        })
      }

      return acc
    }, [] as any[])

    return NextResponse.json(consolidatedData)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    )
  }
}
