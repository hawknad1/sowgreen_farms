import prisma from "@/lib/prismadb"
import { CheckoutSchema } from "@/schemas"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, address, email, city, region, country, phone } =
      await req.json()

    const validation = CheckoutSchema.safeParse({
      name,
      address,
      email,
      city,
      region,
      country,
      phone,
    })

    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ errors: validation.error.errors }),
        { status: 400 }
      )
    }

    const customerAddress = await prisma.shippingAddress.create({
      data: {
        name,
        address,
        email,
        city,
        region,
        country,
        phone,
      },
    })

    return new NextResponse(JSON.stringify(customerAddress), { status: 201 })
  } catch (error) {
    console.error(error) // Use console.error for logging errors to stderr
    return new NextResponse(JSON.stringify({ error: "Server error" }), {
      status: 500,
    })
  }
}
