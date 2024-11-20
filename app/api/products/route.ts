import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      description,
      imageUrl,
      images,
      price,
      unit,
      weight,
      categoryName,
      quantity,
      discount,
      isInStock,
    } = await req.json()

    // Validate required fields
    if (
      !title ||
      !description ||
      !price ||
      !weight ||
      !unit ||
      !categoryName ||
      typeof quantity !== "number" || // Ensure quantity is a number
      quantity <= 0 // Ensure quantity is positive
    ) {
      return NextResponse.json(
        {
          error:
            "Title, Description, at least one Weight-Price pair, Category, and Quantity are required!",
        },
        { status: 400 } // 400 Bad Request for missing fields
      )
    }

    // Check for existing product with the same title
    const existingProduct = await prisma.product.findUnique({
      where: {
        title,
      },
    })

    if (existingProduct) {
      return NextResponse.json(
        { message: "Product already exists!" },
        { status: 400 } // 400 Bad Request for duplicate entry
      )
    }

    // Create new product
    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        imageUrl,
        images,
        categoryName,
        quantity,
        unit,
        discount: discount ?? null, // Set to null if not provided
        isInStock: isInStock || "out-of-stock", // Default to "out-of-stock" if not provided
        price,
        weight,
      },
    })

    return NextResponse.json(newProduct, { status: 201 }) // 201 Created
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Couldn't create product" },
      { status: 500 } // 500 Internal Server Error for any other issues
    )
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     const products = await prisma.product.findMany()
//     return NextResponse.json(products, { status: 200 }) // 200 OK for successful response
//   } catch (error) {
//     console.error("Error fetching products:", error)
//     return NextResponse.json(
//       { error: "Couldn't get all products" },
//       { status: 500 } // 500 Internal Server Error for any other issues
//     )
//   }
// }

export async function GET(req: NextRequest) {
  try {
    // Extract search query from URL
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query")

    // Fetch products based on query or return all products
    const products = await prisma.product.findMany({
      where: query
        ? {
            title: {
              contains: query, // Search for partial matches
              mode: "insensitive", // Case-insensitive search
            },
          }
        : undefined, // If no query, return all products
    })

    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Couldn't get all products" },
      { status: 500 }
    )
  }
}
