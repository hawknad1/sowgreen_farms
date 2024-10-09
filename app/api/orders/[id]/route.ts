import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        shippingAddress: true,
        products: {
          include: {
            product: true, // Include product details in the response
          },
        },
      },
    })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ message: "couldnt fetch order!" })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { status, dispatchRider } = await req.json()
  const id = params.id
  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        dispatchRider,
      },
    })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ message: "Error editing status" })
  }
}
