import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const address = await prisma.shippingAddress.findMany()
    return NextResponse.json(address, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Couldnt fetch shipping address!" },
      { status: 500 }
    )
  }
}
