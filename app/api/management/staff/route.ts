import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { fullName, jobTitle, email, role, phone } = await req.json()

  if (!fullName || !jobTitle || !phone || !role) {
    return NextResponse.json(
      { message: '"Gender, First and Last name are required"' },
      { status: 400 }
    )
  }

  try {
    const newStaff = await prisma.staff.create({
      data: {
        fullName,
        jobTitle,
        role,
        phone,
        email,
      },
    })
    return NextResponse.json(newStaff, { status: 201 })
  } catch (error) {
    console.error("Error adding rider:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const staff = await prisma.staff.findMany()
    return NextResponse.json(staff, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Couldnt fetch list of staff" },
      { status: 500 }
    )
  }
}
