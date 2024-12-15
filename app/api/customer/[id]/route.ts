import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  try {
    const customer = await prisma.customer.findMany({
      where: { id },
      include: {
        orders: true,
        shippingAddresses: true,
      },
    })

    return NextResponse.json(customer, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Couldnt fetch customer" },
      { status: 500 }
    )
  }
}
