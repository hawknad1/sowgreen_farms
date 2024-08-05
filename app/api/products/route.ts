import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      price,
      description,
      imageUrl,
      categoryName,
      quantity,
      discount,
      isInStock,
    } = await req.json()

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and Description are required!" },
        { status: 400 } // 400 Bad Request for missing fields
      )
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        price,
        description,
        imageUrl,
        categoryName,
        quantity,
        discount,
        isInStock,
      },
    })

    // console.log("Product created")
    return NextResponse.json(newProduct, { status: 201 }) // 201 Created
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Couldn't create product" },
      { status: 500 } // 500 Internal Server Error for any other issues
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany()
    return NextResponse.json(products, { status: 200 }) // 200 OK for successful response
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Couldn't get all products" },
      { status: 500 } // 500 Internal Server Error for any other issues
    )
  }
}
