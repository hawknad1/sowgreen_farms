import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          include: {
            partner: true,
          },
        },
      },
    })
    const response = NextResponse.json(categories, { status: 200 })
    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://sowgreen-farms.vercel.app"
    )
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")

    return response
  } catch (error) {
    return NextResponse.json(
      { message: "couldnt fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const { categoryName, imageUrl, link } = await req.json()
  try {
    if (!categoryName) {
      return NextResponse.json({ message: "category name is required!" })
    }
    const newCategory = await prisma.category.create({
      data: {
        categoryName,
        imageUrl,
        link,
      },
      include: { products: true },
    })
    return NextResponse.json(newCategory)
  } catch (error) {
    return NextResponse.json({ message: "Couldnt create new category" })
  }
}
