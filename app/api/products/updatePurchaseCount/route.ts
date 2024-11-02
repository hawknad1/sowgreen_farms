// app/api/products/updatePurchaseCount/route.ts
import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { productIds } = await request.json()
    await Promise.all(
      productIds.map((productId: string) =>
        prisma.product.update({
          where: { id: productId },
          data: { purchaseCount: { increment: 1 } },
        })
      )
    )

    return NextResponse.json({ message: "Purchase counts updated" })
  } catch (error) {
    console.error("Error updating purchase counts:", error)
    return NextResponse.json(
      { error: "Failed to update purchase counts" },
      { status: 500 }
    )
  }
}
