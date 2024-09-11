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
