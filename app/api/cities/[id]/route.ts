import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  try {
    const { region, city, deliveryFee } = await req.json()

    if (!region || !city || typeof deliveryFee !== "number") {
      return NextResponse.json(
        { message: "Valid region, city, and delivery fee are required." },
        { status: 400 }
      )
    }

    const updatedLocation = await prisma.citiesWithFees.update({
      where: { id },
      data: { city, deliveryFee, region },
    })

    return NextResponse.json(updatedLocation, { status: 200 })
  } catch (error) {
    console.error("Error updating location:", error)
    return NextResponse.json(
      { message: "An error occurred while updating the location." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    const deleteLocation = await prisma.citiesWithFees.delete({
      where: {
        id,
      },
    })
    return NextResponse.json(
      { message: "Location deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Couldnt delete location" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const location = await prisma.citiesWithFees.findUnique({
      where: { id },
    })
    return NextResponse.json(location)
  } catch (error) {
    return NextResponse.json(
      { message: "couldnt fetch city!" },
      { status: 500 }
    )
  }
}
