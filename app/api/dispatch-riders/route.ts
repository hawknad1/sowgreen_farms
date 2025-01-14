import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { gender, firstName, lastName, phone } = await req.json()

  if (!firstName || !lastName || !phone) {
    return NextResponse.json(
      { message: '"Gender, First and Last name are required"' },
      { status: 400 }
    )
  }

  try {
    const newRider = await prisma.dispatchRider.create({
      data: {
        gender,
        firstName,
        lastName,
        phone,
      },
    })
    return NextResponse.json(newRider, { status: 201 })
  } catch (error) {
    console.error("Error adding rider:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const riders = await prisma.dispatchRider.findMany()
    return NextResponse.json(riders, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Couldnt fetch list of riders" },
      { status: 500 }
    )
  }
}
