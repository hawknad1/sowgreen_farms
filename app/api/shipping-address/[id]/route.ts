import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  try {
    const address = await prisma.shippingAddress.findUnique({
      where: { id },
    })
    return NextResponse.json(address, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Couldnt fetch shipping address" })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { address, city, deliveryMethod, email, phone, name, region } =
    await req.json()
  const id = params.id
  try {
    const updatedAddress = await prisma.shippingAddress.update({
      where: { id },
      data: { address, city, deliveryMethod, email, phone, name, region },
    })
    return NextResponse.json(updatedAddress, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Couldnt updated shipping address" })
  }
}
