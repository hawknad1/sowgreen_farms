// app/api/products/updateQuantity/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export async function POST(request: Request) {
  try {
    const {
      products,
    }: { products: { item: { id: string }; quantity: number }[] } =
      await request.json()

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    for (const orderProduct of products) {
      const { item, quantity } = orderProduct

      if (!item?.id) {
        console.error("Missing productId in request:", orderProduct)
        return NextResponse.json(
          { error: "productId is required for each product" },
          { status: 400 }
        )
      }

      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { quantity: true },
      })

      if (product) {
        if (product.quantity >= quantity) {
          const updatedQuantity = product.quantity - quantity

          // Determine the new isInStock status
          const isInStock = updatedQuantity > 0 ? "in-stock" : "out-of-stock"

          // Update the product with new quantity and isInStock status
          await prisma.product.update({
            where: { id: item.id },
            data: {
              quantity: updatedQuantity,
              isInStock: isInStock, // Update isInStock based on the new quantity
            },
          })
        } else {
          throw new Error(`Insufficient stock for product with ID: ${item.id}`)
        }
      } else {
        throw new Error(`Product with ID: ${item.id} not found`)
      }
    }

    return NextResponse.json({
      message: "Product quantities updated successfully",
    })
  } catch (error) {
    console.error("Error updating quantities:", error)
    return NextResponse.json(
      { error: "Failed to update product quantities" },
      { status: 500 }
    )
  }
}
