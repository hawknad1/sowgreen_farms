import prisma from "@/lib/prismadb"
import { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { city, deliveryFee, region } = await req.json()

  if (!city || !deliveryFee || !region) {
    return NextResponse.json(
      { message: '"City,region and delivery fee are required"' },
      { status: 400 }
    )
  }

  try {
    const newCity = await prisma.citiesWithFees.create({
      data: {
        city,
        deliveryFee: parseFloat(deliveryFee),
        region,
      },
    })
    return NextResponse.json(newCity, { status: 201 })
  } catch (error) {
    console.error("Error adding city:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const cityList = await prisma.citiesWithFees.findMany()
    return NextResponse.json(cityList, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Couldnt fetch list of cities" },
      { status: 500 }
    )
  }
}
