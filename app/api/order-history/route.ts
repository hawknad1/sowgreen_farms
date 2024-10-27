import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const orderHistory = await prisma.shippingAddress.findMany({
      include: {
        orders: true,
      },
    })
    return NextResponse.json(orderHistory, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: "Couldnt fetch orders" },
      { status: 500 }
    )
  }
}
