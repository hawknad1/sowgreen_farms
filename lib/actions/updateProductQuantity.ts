import { Order, Product } from "@/types"
import prisma from "../prismadb"

export async function updateProductQuantities(order: any) {
  for (const orderProduct of order.products) {
    const { productId, quantity } = orderProduct

    // Fetch the current quantity of the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { quantity: true },
    })

    if (product && product.quantity >= quantity) {
      // Calculate the new quantity
      const updatedQuantity = product.quantity - quantity

      // Update the product quantity in the database
      await prisma.product.update({
        where: { id: productId },
        data: { quantity: updatedQuantity },
      })
    } else {
      throw new Error(`Insufficient stock for product with ID: ${productId}`)
    }
  }
}
