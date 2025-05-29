import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  try {
    const { fullName, jobTitle, email, role, phone } = await req.json()

    if (!fullName || !jobTitle || !phone || !role) {
      return NextResponse.json(
        { message: "Valid name, job title, phone and role are required." },
        { status: 400 }
      )
    }

    const updatedStaff = await prisma.staff.update({
      where: { id },
      data: { fullName, jobTitle, email, role, phone },
    })

    return NextResponse.json(updatedStaff, { status: 200 })
  } catch (error) {
    console.error("Error updating staff:", error)
    return NextResponse.json(
      { message: "An error occurred while updating the staff." },
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
    const deleteStaff = await prisma.staff.delete({
      where: {
        id,
      },
    })
    return NextResponse.json(
      { message: "Staff deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Couldnt delete staff" },
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
    const staff = await prisma.staff.findUnique({
      where: { id },
    })
    return NextResponse.json(staff)
  } catch (error) {
    return NextResponse.json(
      { message: "couldnt fetch staff!" },
      { status: 500 }
    )
  }
}
