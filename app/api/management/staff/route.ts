import { auth } from "@/auth"
import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
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
    console.log("Error adding rider:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
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
