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
        products: {
          include: {
            product: true, // Include product details in the response
          },
        },
      },
    })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ message: "couldnt fetch order!" })
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

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { status, dispatchRider, paymentAction, products } = await req.json()
//   const orderId = params.id // The order ID from the URL

//   try {
//     // Step 1: Fetch the current order to see existing products
//     const existingOrder = await prisma.order.findUnique({
//       where: { id: orderId },
//       include: { products: { include: { product: true } } }, // Include products and product details
//     })

//     if (!existingOrder) {
//       return NextResponse.json({ message: "Order not found" }, { status: 404 })
//     }

//     // Step 2: Handle the products array
//     const updatedProductsPromises = products.map(
//       async (product: { productId: string; quantity: number }) => {
//         // Check if the product already exists in the order
//         const existingProductOrder = existingOrder.products.find(
//           (p) => p.productId === product.productId
//         )

//         if (existingProductOrder) {
//           // Update the quantity directly, instead of adding to the old quantity
//           const newQuantity = product.quantity
//           const newQuantityTotal =
//             newQuantity * existingProductOrder.product.price

//           return prisma.productOrder.update({
//             where: { id: existingProductOrder.id },
//             data: {
//               quantity: newQuantity, // Set the new quantity directly
//               quantityTotal: newQuantityTotal.toString(), // Recalculate the total based on new quantity
//             },
//           })
//         }

//         // If the product is new, create a new ProductOrder record
//         const productDetails = await prisma.product.findUnique({
//           where: { id: product.productId },
//         })

//         if (!productDetails) {
//           throw new Error(`Product with id ${product.productId} not found`)
//         }

//         const quantityTotal = (
//           product.quantity * (productDetails.price || 0)
//         ).toString()

//         return prisma.productOrder.create({
//           data: {
//             orderId: orderId,
//             productId: product.productId,
//             quantity: product.quantity,
//             quantityTotal: quantityTotal, // Set quantityTotal based on price and quantity
//           },
//         })
//       }
//     )

//     // Step 3: Execute the product updates or additions
//     const updatedProductOrders = await Promise.all(updatedProductsPromises)

//     // Step 4: Update the order's total (recalculate the total based on updated products)
//     const updatedOrder = await prisma.order.update({
//       where: { id: orderId },
//       data: {
//         status,
//         dispatchRider,
//         paymentAction,
//         // Recalculate total using the updated products
//         total: await getTotalForOrder(orderId), // You can write a function to calculate the total
//       },
//       include: {
//         products: { include: { product: true } }, // Include products in the updated order response
//       },
//     })

//     return NextResponse.json(updatedOrder) // Return the updated order with the new product details
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json(
//       { message: "Error editing order" },
//       { status: 500 }
//     )
//   }
// }

// // Function to calculate the total for an order
// async function getTotalForOrder(orderId: string) {
//   const orderWithProducts = await prisma.order.findUnique({
//     where: { id: orderId },
//     include: {
//       products: { include: { product: true } }, // Include product details
//     },
//   })

//   if (!orderWithProducts) {
//     return 0
//   }

//   // Calculate total by summing up the price * quantity for each product
//   const total = orderWithProducts.products.reduce((sum, productOrder) => {
//     const price = productOrder.product.price || 0 // Assuming price is available on product
//     const quantity = productOrder.quantity
//     return sum + price * quantity
//   }, 0)

//   return total
// }

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { status, dispatchRider, paymentAction, products } = await req.json()
  const orderId = params.id

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { products: { include: { product: true } } },
    })

    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    const updatedProductsPromises = products.map(
      async (product: { productId: string; quantity: number }) => {
        const { productId, quantity } = product

        const existingProductOrder = existingOrder.products.find(
          (p) => p.productId === productId
        )

        if (existingProductOrder) {
          const newQuantityTotal = (
            quantity * existingProductOrder.product.price
          ).toString()

          return prisma.productOrder.update({
            where: { id: existingProductOrder.id },
            data: {
              quantity,
              quantityTotal: newQuantityTotal,
            },
          })
        }

        const productDetails = await prisma.product.findUnique({
          where: { id: productId },
        })

        if (!productDetails) {
          throw new Error(`Product with id ${productId} not found`)
        }

        const quantityTotal = (
          quantity * (productDetails.price || 0)
        ).toString()

        return prisma.productOrder.create({
          data: {
            orderId,
            productId,
            quantity,
            quantityTotal,
          },
        })
      }
    )

    await Promise.all(updatedProductsPromises)

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        dispatchRider,
        paymentAction,
        total: await getTotalForOrder(orderId),
      },
      include: { products: { include: { product: true } } },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Error editing order" },
      { status: 500 }
    )
  }
}

async function getTotalForOrder(orderId: string) {
  const orderWithProducts = await prisma.order.findUnique({
    where: { id: orderId },
    include: { products: { include: { product: true } } },
  })

  if (!orderWithProducts) return 0

  return orderWithProducts.products.reduce((sum, productOrder) => {
    const price = productOrder.product.price || 0
    return sum + price * productOrder.quantity
  }, 0)
}
