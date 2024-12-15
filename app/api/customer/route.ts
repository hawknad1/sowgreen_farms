import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const customer = await prisma.customer.findMany({
      include: { orders: true, shippingAddresses: true },
    })
    return NextResponse.json(customer, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Couldnt fetch customers!" })
  }
}
