// app/api/products/[slug]/price-history/route.ts
import { auth } from "@/auth"
import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        priceHistory: {
          include: {
            product: {
              select: {
                title: true,
                slug: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        variants: {
          include: {
            priceHistory: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      productPriceHistory: product.priceHistory,
      variantPriceHistory: product.variants.flatMap((v) => v.priceHistory),
    })
  } catch (error) {
    console.error("Error fetching price history:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
