import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const popularProducts = await prisma.product.findMany({
      orderBy: { purchaseCount: "desc" },
      take: 10, // Limit to top 10, adjust as needed
    })
    return NextResponse.json(popularProducts, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve popular products" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { productIds } = await request.json()

    for (const productId of productIds) {
      await prisma.product.update({
        where: { id: productId },
        data: { purchaseCount: { increment: 1 } },
      })
    }

    return NextResponse.json({ message: "Purchase counts updated" })
  } catch (error) {
    console.error("Error updating purchase counts:", error)
    return NextResponse.json(
      { error: "Failed to update purchase counts" },
      { status: 500 }
    )
  }
}
