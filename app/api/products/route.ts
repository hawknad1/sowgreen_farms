import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

// export async function POST(req: NextRequest) {
//   try {
//     const {
//       title,
//       description,
//       imageUrl,
//       images,
//       categoryName,
//       quantity,
//       discount,
//       isInStock,
//       variants,
//     } = await req.json()

//     // Validate required fields
//     if (
//       !title ||
//       !description ||
//       !variants ||
//       !categoryName ||
//       typeof quantity !== "number" || // Ensure quantity is a number
//       quantity <= 0 // Ensure quantity is positive
//     ) {
//       return NextResponse.json(
//         {
//           error:
//             "Title, Description, at least one Weight-Price pair, Category, and Quantity are required!",
//         },
//         { status: 400 } // 400 Bad Request for missing fields
//       )
//     }

//     // Check for existing product with the same title
//     const existingProduct = await prisma.product.findUnique({
//       where: {
//         title,
//       },
//     })

//     if (existingProduct) {
//       return NextResponse.json(
//         { message: "Product already exists!" },
//         { status: 400 } // 400 Bad Request for duplicate entry
//       )
//     }

//     // Create new product
//     const newProduct = await prisma.product.create({
//       data: {
//         title,
//         description,
//         imageUrl,
//         images,
//         categoryName,
//         quantity,
//         discount: discount ?? null, // Set to null if not provided
//         isInStock: isInStock || "out-of-stock", // Default to "out-of-stock" if not provided
//         variants,
//       },
//     })

//     return NextResponse.json(newProduct, { status: 201 }) // 201 Created
//   } catch (error) {
//     console.log("Error creating product:", error)
//     return NextResponse.json(
//       { error: "Couldn't create product" },
//       { status: 500 } // 500 Internal Server Error for any other issues
//     )
//   }
// }

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

// export async function GET(req: NextRequest) {
//   try {
//     // Extract search query from URL
//     const { searchParams } = new URL(req.url)
//     const query = searchParams.get("query")

//     // Fetch products based on query or return all products
//     const products = await prisma.product.findMany({
//       where: query
//         ? {
//             title: {
//               contains: query, // Search for partial matches
//               mode: "insensitive", // Case-insensitive search
//             },
//           }
//         : undefined, // If no query, return all products
//     })

//     return NextResponse.json(products, { status: 200 })
//   } catch (error) {
//     console.error("Error fetching products:", error)
//     return NextResponse.json(
//       { error: "Couldn't get all products" },
//       { status: 500 }
//     )
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      description,
      imageUrl,
      images,
      categoryName,
      quantity,
      discount,
      isInStock,
      variants,
    } = await req.json()

    // Validate required fields
    if (
      !title ||
      !description ||
      // !variants ||
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
      where: { title },
    })

    if (existingProduct) {
      return NextResponse.json(
        { message: "Product already exists!" },
        { status: 400 } // 400 Bad Request for duplicate entry
      )
    }

    // Check if variants is properly structured
    if (!Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json(
        {
          error: "At least one variant (weight-price pair) is required!",
        },
        { status: 400 }
      )
    }

    const isValidVariants = variants.every(
      (variant: { price: number; weight?: number; unit?: string }) =>
        typeof variant.price === "number" &&
        (typeof variant.weight === "number" || variant.weight === undefined) &&
        (typeof variant.unit === "string" || variant.unit === undefined)
    )

    if (!isValidVariants) {
      return NextResponse.json(
        { error: "Invalid variants structure!" },
        { status: 400 }
      )
    }

    // Create new product with nested variants
    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        imageUrl,
        images: images ?? [], // Default to empty array if not provided
        categoryName,
        quantity,
        discount: discount ?? null, // Set to null if not provided
        isInStock: isInStock || "out-of-stock", // Default to "out-of-stock" if not provided
        variants: {
          create: variants.map(
            (variant: { price: number; weight: number; unit: string }) => ({
              price: variant.price,
              weight: variant?.weight,
              unit: variant?.unit,
            })
          ),
        },
      },
      include: {
        variants: true,
      },
    })

    return NextResponse.json(newProduct, { status: 201 }) // 201 Created
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Couldn't create product" },
      { status: 500 } // 500 Internal Server Error for unexpected issues
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Extract search query from URL
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query")

    // If no query, return all products
    if (!query) {
      const products = await prisma.product.findMany({
        include: {
          variants: true,
        },
      })
      return NextResponse.json(products, { status: 200 })
    }

    // Normalize query (convert to lowercase for case insensitivity)
    const normalizedQuery = query.toLowerCase()

    // Fetch products based on normalized query (case insensitive search)
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: normalizedQuery, // Search for partial matches
          mode: "insensitive", // Case-insensitive search
        },
      },
      include: {
        variants: true,
      },
    })

    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Couldn't get all products" },
      { status: 500 }
    )
  }
}
