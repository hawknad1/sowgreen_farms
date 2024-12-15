import prisma from "@/lib/prismadb"
import { ProductOrder } from "@/types"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        shippingAddress: true,
        products: {
          include: {
            product: true, // Include product details in the response
          },
        },
      },
    })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json(
      { message: "couldnt fetch order!" },
      { status: 500 }
    )
  }
}

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { status, dispatchRider, paymentAction, products } = await req.json()
//   const id = params.id
//   try {
//     const order = await prisma.order.update({
//       where: { id },
//       data: {
//         status,
//         dispatchRider,
//         paymentAction,
//         products,
//       },
//     })
//     return NextResponse.json(order)
//   } catch (error) {
//     return NextResponse.json({ message: "Error editing status" })
//   }
// }

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const deletedOrder = await prisma.order.delete({
      where: { id },
    })
    return NextResponse.json(
      { message: "Order deleted successfully", deletedOrder },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Delete order error:", error)

    if (error.code === "P2025") {
      // Prisma specific error for "Record not found"
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(
      { message: "Failed to delete order", error: error.message },
      { status: 500 }
    )
  }
}

async function getTotalForOrder(orderId: string): Promise<number> {
  const orderWithProducts = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!orderWithProducts) return 0

  return orderWithProducts.products.reduce((sum, productOrder) => {
    if (productOrder.available === false) return sum // Skip out-of-stock items
    const price = productOrder.product.price || 0
    return sum + price * productOrder.quantity
  }, 0)
}

// Main API handler for updating an order
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const {
    status,
    dispatchRider,
    paymentAction,
    deliveryDate,
    deliveryMethod,
    products,
  } = await req.json()
  const orderId = params.id

  try {
    // Fetch the existing order with related products
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { products: { include: { product: true } } },
    })

    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    if (products?.length) {
      const updatedProductsPromises = products.map(
        async (product: ProductOrder) => {
          const { productId, quantity, available } = product

          const existingProductOrder = existingOrder.products.find(
            (p) => p.productId === productId
          )

          if (existingProductOrder) {
            return prisma.productOrder.update({
              where: { id: existingProductOrder.id },
              data: {
                quantity,
                quantityTotal:
                  available !== false
                    ? (quantity * existingProductOrder.product.price).toString()
                    : "0",
                available,
              },
            })
          }

          const productDetails = await prisma.product.findUnique({
            where: { id: productId },
          })

          if (!productDetails) {
            throw new Error(`Product with id ${productId} not found`)
          }

          return prisma.productOrder.create({
            data: {
              orderId,
              productId,
              quantity,
              quantityTotal:
                available !== false
                  ? (quantity * (productDetails.price || 0)).toString()
                  : "0",
              available,
            },
          })
        }
      )

      await Promise.all(updatedProductsPromises)
    }

    // ** Step 2: Update order fields **
    const updateData: Record<string, any> = {
      status,
      dispatchRider,
      paymentAction,
      deliveryDate,
      deliveryMethod,
    }

    // Recalculate total only if `products` is provided
    if (products?.length) {
      updateData.total = await getTotalForOrder(orderId)
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: { products: { include: { product: true } } },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { message: "Error editing order" },
      { status: 500 }
    )
  }
}
