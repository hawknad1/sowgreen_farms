import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  try {
    const { region, city, address } = await req.json()

    if (!address) {
      return NextResponse.json(
        { message: "Address is required." },
        { status: 400 }
      )
    }

    const updatedLocation = await prisma.pickupLocations.update({
      where: { id },
      data: { region, city, address },
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
    const deleteLocation = await prisma.pickupLocations.delete({
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
