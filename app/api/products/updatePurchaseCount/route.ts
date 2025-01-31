// app/api/products/updatePurchaseCount/route.ts
import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

// export async function POST(request: Request) {
//   try {
//     const { productIds, productQuantity } = await request.json()
//     await Promise.all(
//       productIds.map((productId: string) =>
//         prisma.product.update({
//           where: { id: productId },
//           data: { purchaseCount: { increment: productQuantity } },
//         })
//       )
//     )

//     return NextResponse.json({ message: "Purchase counts updated" })
//   } catch (error) {
//     console.error("Error updating purchase counts:", error)
//     return NextResponse.json(
//       { error: "Failed to update purchase counts" },
//       { status: 500 }
//     )
//   }
// }

export async function POST(request: Request) {
  try {
    const {
      products,
    }: { products: { item: { productId: string; quantity: number } }[] } =
      await request.json()

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    // Update purchaseCount for each product
    await Promise.all(
      products.map(async (product) => {
        const { item } = product
        const { productId, quantity } = item

        if (!productId || !quantity) {
          console.error("Missing productId or quantity in request:", product)
          throw new Error(
            "productId and quantity are required for each product"
          )
        }

        // Update the product's purchaseCount
        await prisma.product.update({
          where: { id: productId },
          data: { purchaseCount: { increment: quantity } },
        })
      })
    )

    return NextResponse.json({
      message: "Purchase counts updated successfully",
    })
  } catch (error) {
    console.error("Error updating purchase counts:", error)
    return NextResponse.json(
      { error: "Failed to update purchase counts" },
      { status: 500 }
    )
  }
}
