import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { rate, country, region, isActive } = await request.json()

    // If setting as active, deactivate all others
    if (isActive) {
      await prisma.taxRate.updateMany({
        where: {
          isActive: true,
          id: { not: params.id },
        },
        data: { isActive: false },
      })
    }

    const taxRate = await prisma.taxRate.update({
      where: { id: params.id },
      data: {
        rate,
        country: country || null,
        region: region || null,
        isActive,
      },
    })

    return NextResponse.json(taxRate)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update tax rate" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.taxRate.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete tax rate" },
      { status: 500 }
    )
  }
}
