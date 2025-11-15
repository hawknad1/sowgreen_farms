import { auth } from "@/auth"
import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - You must be logged in" },
        { status: 401 }
      )
    }

    // 2. Check user role (if you have admin/users distinction)
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email },
    })

    if (user?.role !== "admin" && user?.role !== "supervisor") {
      // Add this if you want admin-only access
      return NextResponse.json(
        { error: "Forbidden - You don't have permission" },
        { status: 403 }
      )
    }
    const id = params.id
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
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - You must be logged in" },
        { status: 401 }
      )
    }

    // 2. Check user role (if you have admin/users distinction)
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email },
    })

    if (user?.role !== "admin" && user?.role !== "supervisor") {
      // Add this if you want admin-only access
      return NextResponse.json(
        { error: "Forbidden - You don't have permission" },
        { status: 403 }
      )
    }
    const { id } = params
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
