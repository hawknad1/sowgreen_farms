// app/api/products/[slug]/history/route.ts
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
        productHistory: {
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
      productHistory: product.productHistory,
      variantHistory: product.variants.flatMap((v) => v.priceHistory),
    })
  } catch (error) {
    console.error("Error fetching product history:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
