// app/api/products/updateQuantity/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

// export async function POST(request: Request) {
//   try {
//     const {
//       products,
//     }: { products: { item: { id: string }; quantity: number }[] } =
//       await request.json()

//     if (!products || !Array.isArray(products)) {
//       return NextResponse.json(
//         { error: "Invalid request body" },
//         { status: 400 }
//       )
//     }

//     for (const orderProduct of products) {
//       const { item, quantity } = orderProduct

//       if (!item?.id) {
//         console.error("Missing productId in request:", orderProduct)
//         return NextResponse.json(
//           { error: "productId is required for each product" },
//           { status: 400 }
//         )
//       }

//       const product = await prisma.product.findUnique({
//         where: { id: item.id },
//         select: { quantity: true },
//       })

//       if (product) {
//         if (product.quantity >= quantity) {
//           const updatedQuantity = product.quantity - quantity

//           // Determine the new isInStock status
//           const isInStock = updatedQuantity > 0 ? "in-stock" : "out-of-stock"

//           // Update the product with new quantity and isInStock status
//           await prisma.product.update({
//             where: { id: item.id },
//             data: {
//               quantity: updatedQuantity,
//               isInStock: isInStock, // Update isInStock based on the new quantity
//             },
//           })
//         } else {
//           throw new Error(`Insufficient stock for product with ID: ${item.id}`)
//         }
//       } else {
//         throw new Error(`Product with ID: ${item.id} not found`)
//       }
//     }

//     return NextResponse.json({
//       message: "Product quantities updated successfully",
//     })
//   } catch (error) {
//     console.error("Error updating quantities:", error)
//     return NextResponse.json(
//       { error: "Failed to update product quantities" },
//       { status: 500 }
//     )
//   }
// }

export async function POST(request: Request) {
  try {
    console.log("=== Update Quantity API Called ===")
    console.log("Environment:", process.env.NODE_ENV)
    console.log("Database URL exists:", !!process.env.DATABASE_URL)

    const body = await request.json()
    console.log("Raw request body:", JSON.stringify(body, null, 2))

    const { products } = body

    // Enhanced validation
    if (!products) {
      console.error("No products field in request")
      return NextResponse.json(
        { error: "Missing 'products' field in request body" },
        { status: 400 }
      )
    }

    if (!Array.isArray(products)) {
      console.error("Products is not an array:", typeof products)
      return NextResponse.json(
        { error: "Products must be an array" },
        { status: 400 }
      )
    }

    if (products.length === 0) {
      console.warn("Empty products array")
      return NextResponse.json({
        message: "No products to update",
      })
    }

    console.log(`Processing ${products.length} products`)

    // Process each product
    for (let i = 0; i < products.length; i++) {
      const orderProduct = products[i]
      console.log(`\n--- Processing product ${i + 1}/${products.length} ---`)
      console.log("Order product:", JSON.stringify(orderProduct, null, 2))

      const { item, quantity } = orderProduct

      // Validate item exists
      if (!item) {
        console.error(`Product ${i + 1}: Missing 'item' field`)
        return NextResponse.json(
          { error: `Product at index ${i} is missing 'item' field` },
          { status: 400 }
        )
      }

      // Validate productId
      if (!item.productId) {
        console.error(`Product ${i + 1}: Missing productId in item:`, item)
        return NextResponse.json(
          { error: `Product at index ${i} is missing 'productId'` },
          { status: 400 }
        )
      }

      // Validate quantity
      if (typeof quantity !== "number" || quantity < 1) {
        console.error(`Product ${i + 1}: Invalid quantity:`, quantity)
        return NextResponse.json(
          { error: `Product at index ${i} has invalid quantity: ${quantity}` },
          { status: 400 }
        )
      }

      console.log(
        `Product ID: ${item.productId}, Quantity to deduct: ${quantity}`
      )

      // Check if product exists
      try {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            title: true,
            quantity: true,
            isInStock: true,
          },
        })

        if (!product) {
          console.error(`Product not found: ${item.productId}`)
          return NextResponse.json(
            {
              error: `Product with ID ${item.productId} not found in database`,
            },
            { status: 404 }
          )
        }

        console.log(
          `Found product: ${product.title}, Current stock: ${product.quantity}`
        )

        // Check stock availability
        if (product.quantity < quantity) {
          console.error(
            `Insufficient stock for ${product.title}. ` +
              `Available: ${product.quantity}, Requested: ${quantity}`
          )
          return NextResponse.json(
            {
              error: `Insufficient stock for ${product.title}`,
              available: product.quantity,
              requested: quantity,
            },
            { status: 400 }
          )
        }

        const updatedQuantity = product.quantity - quantity
        const isInStock = updatedQuantity > 0 ? "in-stock" : "out-of-stock"

        console.log(
          `Updating: ${product.title} | ` +
            `${product.quantity} → ${updatedQuantity} | ` +
            `Status: ${isInStock}`
        )

        // Update the product
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: updatedQuantity,
            isInStock: isInStock,
          },
        })

        console.log(`✅ Successfully updated ${product.title}`)
      } catch (dbError: any) {
        console.error(`Database error for product ${item.productId}:`, dbError)
        throw dbError
      }
    }

    console.log("\n=== All products updated successfully ===")
    return NextResponse.json({
      message: "Product quantities updated successfully",
      updated: products.length,
    })
  } catch (error: any) {
    console.error("=== FATAL ERROR in updateQuantity ===")
    console.error("Error name:", error?.name)
    console.error("Error message:", error?.message)
    console.error("Error stack:", error?.stack)

    // Check for specific Prisma errors
    if (error?.code) {
      console.error("Prisma error code:", error.code)
    }

    return NextResponse.json(
      {
        error: "Failed to update product quantities",
        details: error?.message,
        code: error?.code,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// export async function POST(request: Request) {
//   try {
//     const {
//       products,
//     }: {
//       products: {
//         item: { productId: string; product: any }
//         quantity: number
//       }[]
//     } = await request.json()

//     if (!products || !Array.isArray(products)) {
//       return NextResponse.json(
//         { error: "Invalid request body" },
//         { status: 400 }
//       )
//     }

//     for (const orderProduct of products) {
//       const { item, quantity } = orderProduct

//       if (!item?.productId) {
//         console.error("Missing productId in request:", orderProduct)
//         return NextResponse.json(
//           { error: "productId is required for each product" },
//           { status: 400 }
//         )
//       }

//       const product = await prisma.product.findUnique({
//         where: { id: item.productId },
//         select: { quantity: true },
//       })

//       if (product) {
//         if (product.quantity >= quantity) {
//           const updatedQuantity = product.quantity - quantity

//           // Determine the new isInStock status
//           const isInStock = updatedQuantity > 0 ? "in-stock" : "out-of-stock"

//           // Update the product with new quantity and isInStock status
//           await prisma.product.update({
//             where: { id: item.productId },
//             data: {
//               quantity: updatedQuantity,
//               isInStock: isInStock, // Update isInStock based on the new quantity
//             },
//           })
//         } else {
//           throw new Error(
//             `Insufficient stock for product with ID: ${item.productId}`
//           )
//         }
//       } else {
//         throw new Error(`Product with ID: ${item.productId} not found`)
//       }
//     }

//     return NextResponse.json({
//       message: "Product quantities updated successfully",
//     })
//   } catch (error) {
//     console.error("Error updating quantities:", error)
//     return NextResponse.json(
//       { error: "Failed to update product quantities" },
//       { status: 500 }
//     )
//   }
// }
