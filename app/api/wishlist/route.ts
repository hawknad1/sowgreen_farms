import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            variants: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Extract products from wishlist items
    const products = wishlist.map((item) => item.product)

    return NextResponse.json(products)
  } catch (error) {
    console.error("[WISHLIST_GET]", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const { productId } = await req.json()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlist.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    })

    if (existingItem) {
      return NextResponse.json(
        { error: "Product already in wishlist" },
        { status: 400 }
      )
    }

    // Add to wishlist
    await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[WISHLIST_POST]", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    const { productId } = await req.json()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Remove from wishlist
    await prisma.wishlist.deleteMany({
      where: {
        userId: session.user.id,
        productId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[WISHLIST_DELETE]", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
