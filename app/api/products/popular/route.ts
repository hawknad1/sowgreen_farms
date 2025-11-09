// app/api/products/popular/route.ts
import prisma from "@/lib/prismadb"
import { TaxService } from "@/lib/serviceCharge"
import { Product } from "@/types"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const popularProducts = await prisma.product.findMany({
      include: { variants: true, productOrders: true },
      orderBy: { purchaseCount: "desc" },
      // take: 10, // Adjust the number as needed
    })

    // const appliedTax = applyTaxToProducts(
    //   popularProducts as unknown as Product[]
    // )

    const productsWithTax = await TaxService.applyTaxToProducts(
      popularProducts as unknown as Product[]
    )

    // return NextResponse.json(popularProducts)
    return NextResponse.json(productsWithTax)
  } catch (error) {
    console.error("Error fetching popular products:", error)
    return NextResponse.json(
      { error: "Failed to fetch popular products" },
      { status: 500 }
    )
  }
}
