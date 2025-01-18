import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const locations = await prisma.pickupLocations.findMany()
    return NextResponse.json(locations, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Couldn't get all pickup locations" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const { region, city, address } = await req.json()

  if (!address) {
    return NextResponse.json(
      { message: "Couldnt add location" },
      { status: 400 }
    )
  }

  try {
    const location = await prisma.pickupLocations.create({
      data: {
        region,
        city,
        address,
      },
    })
    return NextResponse.json(location, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  const { pickupLocations } = await req.json()

  if (
    !pickupLocations ||
    !Array.isArray(pickupLocations) ||
    pickupLocations.length === 0
  ) {
    return NextResponse.json(
      { message: "Please select at least one pickup location" },
      { status: 400 }
    )
  }

  try {
    // Delete existing pickup options
    await prisma.pickupLocations.deleteMany({})

    // Add the new pickup options
    const updatedLocations = await prisma.pickupLocations.createMany({
      data: pickupLocations.map((option: string) => ({ address: option })),
    })

    return NextResponse.json(updatedLocations, { status: 200 })
  } catch (error) {
    console.error("Error updating pickup locations:", error)
    return NextResponse.json(
      { message: "Couldn't update pickup locations" },
      { status: 500 }
    )
  }
}
