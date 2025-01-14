import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  try {
    const { gender, firstName, lastName, phone } = await req.json()

    if (!gender || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { message: "Valid gender, firstname, and lastname are required." },
        { status: 400 }
      )
    }

    const updatedRider = await prisma.dispatchRider.update({
      where: { id },
      data: { gender, firstName, lastName, phone },
    })

    return NextResponse.json(updatedRider, { status: 200 })
  } catch (error) {
    console.error("Error updating rider:", error)
    return NextResponse.json(
      { message: "An error occurred while updating the rider." },
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
    const deleteRider = await prisma.dispatchRider.delete({
      where: {
        id,
      },
    })
    return NextResponse.json(
      { message: "Rider deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Couldnt delete rider" },
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
    const rider = await prisma.dispatchRider.findUnique({
      where: { id },
    })
    return NextResponse.json(rider)
  } catch (error) {
    return NextResponse.json(
      { message: "couldnt fetch rider!" },
      { status: 500 }
    )
  }
}
