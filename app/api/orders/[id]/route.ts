import prisma from "@/lib/prismadb"
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
        dispatchRider: true,
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
    const price = productOrder.price || 0
    return sum + price * productOrder.quantity
  }, 0)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const {
    status,
    dispatchRider,
    paymentAction,
    last4Digits,
    cardType,
    paymentMode,
    deliveryDate,
    deliveryMethod,
    whatsappOptIn,
    deliveryFee,
    shippingAddress,
    referenceNumber,
    balanceDeducted,
    updatedBalance,
    balanceApplied,
    creditAppliedTotal,
    updatedOrderTotal,
    address,
    city,
    region,
    phone,
    email,
    products, // Allow products to be undefined to signify no change
  } = await req.json()

  const orderId = params.id

  const whatsappOptInBool = Boolean(whatsappOptIn)

  try {
    // Fetch the existing order with related products
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { products: { include: { product: true } } },
    })

    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Update or create the dispatch rider if provided
    let dispatchRiderId = existingOrder.dispatchRiderId

    if (dispatchRider) {
      const { firstName, lastName, phone } = dispatchRider

      const existingRider = await prisma.dispatchRider.findFirst({
        where: { firstName, lastName, phone },
      })

      if (existingRider) {
        dispatchRiderId = existingRider.id
      } else if (dispatchRiderId) {
        // Update existing dispatch rider by ID
        await prisma.dispatchRider.update({
          where: { id: dispatchRiderId },
          data: { firstName, lastName, phone },
        })
      } else {
        // Create a new dispatch rider if no match is found
        const newDispatchRider = await prisma.dispatchRider.create({
          data: { firstName, lastName, phone },
        })
        dispatchRiderId = newDispatchRider.id
      }
    }

    // Handle product updates only if `products` is defined
    if (products !== undefined) {
      if (products.length === 0) {
        // If `products` is explicitly an empty array, remove all products from the order
        await prisma.productOrder.deleteMany({
          where: { orderId },
        })
      } else {
        // Identify productOrder entries that should be removed
        const incomingProductIds = products.map((p: any) => p.productId)
        const productOrdersToRemove = existingOrder.products.filter(
          (p) => !incomingProductIds.includes(p.productId)
        )

        // Remove products that are no longer in the order
        const deletePromises = productOrdersToRemove.map((p) =>
          prisma.productOrder.delete({ where: { id: p.id } })
        )
        await Promise.all(deletePromises)

        // Add or update products in the order
        const updatedProductsPromises = products.map(
          async (product: {
            productId: string
            quantity: number
            price: number | null
            weight: number | null
            unit: string | null
            available: boolean
          }) => {
            const { productId, quantity, available, price, weight, unit } =
              product

            const existingProductOrder = existingOrder.products.find(
              (p) => p.productId === productId
            )

            if (existingProductOrder) {
              // Update the existing product in the order
              return prisma.productOrder.update({
                where: { id: existingProductOrder.id },
                data: {
                  quantity,
                  quantityTotal:
                    available !== false
                      ? (
                          quantity * (existingProductOrder.price || 0)
                        ).toString()
                      : "0",
                  available,
                },
              })
            }

            // Fetch product details for new product additions
            const productDetails = await prisma.product.findUnique({
              where: { id: productId },
            })

            if (!productDetails) {
              throw new Error(`Product with id ${productId} not found`)
            }

            // Add the new product to the order
            return prisma.productOrder.create({
              data: {
                orderId,
                productId,
                quantity,
                price: price || productDetails.price || 0,
                weight: weight || productDetails.weight || null,
                unit: unit || productDetails.unit || null,
                quantityTotal:
                  available !== false
                    ? (
                        quantity * (price || productDetails.price || 0)
                      ).toString()
                    : "0",
                available,
              },
            })
          }
        )

        await Promise.all(updatedProductsPromises)
      }
    }

    // Recalculate the total for the order
    const updatedTotal = await getTotalForOrder(orderId)

    // Update the order with new total and other details
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        total: updatedTotal,
        status,
        // dispatchRider,
        dispatchRider: dispatchRiderId
          ? {
              connect: { id: dispatchRiderId },
            }
          : undefined,
        paymentAction,
        deliveryDate,
        balanceDeducted,
        balanceApplied,
        deliveryFee,
        last4Digits,
        cardType,
        paymentMode,
        referenceNumber,
        updatedOrderTotal,
        whatsappOptIn: whatsappOptInBool,
        updatedBalance,
        creditAppliedTotal,
        shippingAddress: {
          update: {
            address,
            city,
            region,
            deliveryMethod,
            phone,
            email,
          },
        },
      },
      include: { products: { include: { product: true } } },
    })

    return NextResponse.json(updatedOrder, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: error }, { status: 500 })
  }
}
