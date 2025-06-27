import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  try {
    const { brand, owner, phone } = await req.json()

    if (!brand || !phone) {
      return NextResponse.json(
        { message: "Brand and phone are required." },
        { status: 400 }
      )
    }

    const updatedPartner = await prisma.partner.update({
      where: { id },
      data: { brand, owner, phone },
    })

    return NextResponse.json(updatedPartner, { status: 200 })
  } catch (error) {
    console.error("Error updating partner:", error)
    return NextResponse.json(
      { message: "An error occurred while updating the partner." },
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
    const deletePartner = await prisma.partner.delete({
      where: {
        id,
      },
    })
    return NextResponse.json(
      { message: "Partner deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Couldnt delete partner" },
      { status: 500 }
    )
  }
}
