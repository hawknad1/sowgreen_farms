// app/api/products/popular/route.ts
import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const popularProducts = await prisma.product.findMany({
      include: { variants: true, productOrders: true },
      orderBy: { purchaseCount: "desc" },
      // take: 10, // Adjust the number as needed
    })

    return NextResponse.json(popularProducts)
  } catch (error) {
    console.error("Error fetching popular products:", error)
    return NextResponse.json(
      { error: "Failed to fetch popular products" },
      { status: 500 }
    )
  }
}
