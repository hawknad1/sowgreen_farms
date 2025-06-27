import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

// POST: Create a new partner (with duplicate check)
export async function POST(request: Request) {
  try {
    const { brand, owner, phone } = await request.json()

    // Validate required fields
    if (!brand || !phone) {
      return NextResponse.json(
        { error: "Brand and owner are required." },
        { status: 400 }
      )
    }

    // Check if partner already exists
    const existingPartner = await prisma.partner.findFirst({
      where: { brand, phone },
    })

    if (existingPartner) {
      return NextResponse.json(
        { error: "Partner with this brand and owner already exists." },
        { status: 409 }
      )
    }

    // Create new partner
    const newPartner = await prisma.partner.create({
      data: { brand, owner, phone },
    })

    return NextResponse.json(newPartner, { status: 201 })
  } catch (error) {
    console.error("Error creating partner:", error)
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    )
  }
}

// GET: Fetch all partners
export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      include: {
        products: true,
      },
    })
    return NextResponse.json(partners)
  } catch (error) {
    console.error("Error fetching partners:", error)
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    )
  }
}
