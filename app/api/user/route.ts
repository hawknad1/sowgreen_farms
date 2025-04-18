import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany({
      include: {
        customer: true,
        orders: {
          include: { shippingAddress: true },
        },
      },
    })

    return NextResponse.json(users, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Couldn't fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { name, address, city, country, dateOfBirth, phone } =
      await req.json()

    const user = await prisma.user.create({
      data: {
        name,
        address,
        city,
        country,
        dateOfBirth,
        phone,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    )
  }
}

// export async function POST(req: Request) {
// }
