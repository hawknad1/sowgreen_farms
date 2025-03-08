import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany({
      include: {
        customer: true,
        orders: {
          include: { shippingAddress: true },
        },
      },
    })
    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Couldnt fetch users" },
      { status: 500 }
    )
  }
}

// export async function POST(req: Request) {
//   try {
//     const { name, email, hashedPassword } = await req.json()

//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         hashedPassword,
//       },
//     })

//     return NextResponse.json(user, { status: 201 })
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json(
//       { message: "Failed to create user" },
//       { status: 500 }
//     )
//   }
// }
