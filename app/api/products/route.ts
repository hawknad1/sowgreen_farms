import { auth } from "@/auth"
import prisma from "@/lib/prismadb"
import { slugify } from "@/lib/utils/slugify"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const internalApiKey = req.headers.get("x-internal-api-key")
    let isInternalRequest = false

    if (internalApiKey && internalApiKey === process.env.INTERNAL_API_KEY) {
      isInternalRequest = true
    }

    // Bypass session and role check for secure internal requests
    if (!isInternalRequest) {
      const session = await auth()
      if (!session) {
        return NextResponse.json(
          { error: "Unauthorized - You must be logged in" },
          { status: 401 }
        )
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user?.email! },
      })

      if (user?.role !== "admin") {
        return NextResponse.json(
          { error: "Forbidden - You don't have permission" },
          { status: 403 }
        )
      }
    }

    const {
      title,
      description,
      imageUrl,
      images,
      categoryName,
      partner,
      quantity,
      discount,
      isInStock,
      variants,
    } = await req.json()

    // Generate initial slug from title
    let slug = slugify(title)
    let counter = 1
    let uniqueSlug = slug

    // Check for existing slugs and make unique if needed
    while (true) {
      const existing = await prisma.product.findFirst({
        where: { slug: uniqueSlug },
      })

      if (!existing) break

      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    // Validate required fields
    if (
      !title ||
      !description ||
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
        { status: 409 } // 409 Conflict is more appropriate for existing resources
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

    // Calculate discounted price if discount is greater than 0
    const variantsWithDiscountedPrice = variants.map(
      (variant: { price: number; weight?: number; unit?: string }) => {
        const discountedPrice =
          discount > 0 ? variant.price * (1 - discount / 100) : null
        return {
          ...variant,
          discountedPrice: discountedPrice ? discountedPrice : null,
        }
      }
    )

    // Create new product with nested variants
    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        slug: uniqueSlug, // Add the generated slug
        imageUrl,
        images: images ?? [], // Default to empty array if not provided
        categoryName,
        quantity,
        partnerId: partner ? partner.id : null, // Use the ID from the partner object
        discount: discount ?? null, // Set to null if not provided
        isInStock: isInStock || "out-of-stock", // Default to "out-of-stock" if not provided
        variants: {
          create: variantsWithDiscountedPrice.map(
            (variant: {
              price: number
              weight?: number
              unit?: string
              discountedPrice?: number
            }) => ({
              price: variant.price,
              weight: variant?.weight,
              unit: variant?.unit,
              discountedPrice: variant?.discountedPrice,
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
    // Provide a more specific error message if possible
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { message: "Product already exists!" },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: "Couldn't create product" },
      { status: 500 } // 500 Internal Server Error for unexpected issues
    )
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const sort = searchParams.get("sort")
//     const category = searchParams.get("category")
//     const discounted = searchParams.get("discounted") // ✨ ADD THIS

//     let where: any = {}
//     let orderBy: any = {}

//     //THIS BLOCK to filter for discounted products
//     if (discounted === "true") {
//       where.discount = {
//         gt: 0, // 'gt' means "greater than"
//       }
//     }

//     if (category && category !== "All Category") {
//       where.categoryName = category
//     }

//     // ✅ FIX 1: Correct sorting logic for price
//     switch (sort) {
//       case "popularity":
//         orderBy = { purchaseCount: "desc" }
//         break
//       case "newest":
//         orderBy = { createdAt: "desc" }
//         break
//       default:
//         orderBy = { title: "asc" }
//         break
//     }

//     const productsFromDb = await prisma.product.findMany({
//       where,
//       orderBy,
//       include: {
//         variants: true,
//         partner: true,
//         category: true,
//       },
//     })

//     // ✅ FIX 2: Type cast the 'images' field and serialize dates
//     const serializedProducts = productsFromDb.map((product) => ({
//       ...product,
//       createdAt: product.createdAt.toISOString(),
//       updatedAt: product.updatedAt.toISOString(),
//       // This tells TypeScript to trust that `images` matches your type
//       images: (product.images as { url: string; publicId: string }[]) || [],
//       variants: product.variants.map((variant) => ({
//         ...variant,
//         createdAt: variant.createdAt.toISOString(),
//         updatedAt: variant.updatedAt.toISOString(),
//       })),
//     }))

//     return NextResponse.json(serializedProducts, { status: 200 })
//   } catch (error) {
//     console.error("Error fetching products:", error)
//     // Provide a more detailed error response for debugging
//     return NextResponse.json(
//       { error: "Couldn't get all products", details: (error as Error).message },
//       { status: 500 }
//     )
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sort = searchParams.get("sort")
    const category = searchParams.get("category")
    const discounted = searchParams.get("discounted")

    // ✨ NEW: Get the search query from the search panel
    const query = searchParams.get("query")

    let where: any = {}
    let orderBy: any = {}

    // --- Your existing filter logic (unchanged) ---
    if (discounted === "true") {
      where.discount = { gt: 0 }
    }

    if (category && category !== "All Category") {
      where.categoryName = category
    }

    // ✨ NEW: Add search logic IF a query is provided ---
    if (query) {
      where.OR = [
        {
          title: {
            contains: query,
            mode: "insensitive", // Case-insensitive
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ]
    }

    // --- Your existing sorting logic (unchanged) ---
    switch (sort) {
      case "popularity":
        orderBy = { purchaseCount: "desc" }
        break
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      default:
        orderBy = { title: "asc" }
        break
    }

    const productsFromDb = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        variants: true,
        partner: true,
        category: true,
      },
    })

    // --- Your existing serialization logic (unchanged) ---
    const serializedProducts = productsFromDb.map((product) => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      images: (product.images as { url: string; publicId: string }[]) || [],
      variants: product.variants.map((variant) => ({
        ...variant,
        createdAt: variant.createdAt.toISOString(),
        updatedAt: variant.updatedAt.toISOString(),
      })),
    }))

    // This returns a raw array, keeping your /products page happy
    return NextResponse.json(serializedProducts, { status: 200 })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Couldn't get all products", details: (error as Error).message },
      { status: 500 }
    )
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     // Extract search query from URL
//     const { searchParams } = new URL(req.url)
//     const query = searchParams.get("query")

//     // If no query, return all products
//     if (!query) {
//       const products = await prisma.product.findMany({
//         include: {
//           variants: true,
//           partner: true,
//         },
//       })
//       return NextResponse.json(products, { status: 200 })
//     }

//     // Normalize query (convert to lowercase for case insensitivity)
//     const normalizedQuery = query.toLowerCase()

//     // Fetch products based on normalized query (case insensitive search)
//     const products = await prisma.product.findMany({
//       where: {
//         title: {
//           contains: normalizedQuery, // Search for partial matches
//           mode: "insensitive", // Case-insensitive search
//         },
//       },
//       include: {
//         variants: true,
//       },
//     })

//     return NextResponse.json({ products }, { status: 200 })
//   } catch (error) {
//     console.error("Error fetching products:", error)
//     return NextResponse.json(
//       { error: "Couldn't get all products" },
//       { status: 500 }
//     )
//   }
// }
