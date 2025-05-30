import { formatCurrency } from "@/lib/utils"
import { Order } from "@/types"

// export function generateOrderConfirmationMessage(order: Order): string {
//   const itemsList = order.products
//     .map((p) => {
//       if (!p) {
//         return "- Product details missing"
//       }

//       if (p.available === false) {
//         return `❌ ${p.product.title} : *N/A*` // Show product as unavailable
//       }
//       const weight = p.weight ? `${p.weight}${p.unit}` : ""
//       return `✅ ${p.quantity}x ${
//         p.product.title
//       } - ${weight} - ${formatCurrency(Number(p.quantityTotal), "GHS")}`
//     })
//     .join("\n")

//   return `
// Hello *${order.shippingAddress.name}*,

// Below is the complete list of products for Order #${order?.orderNumber}

// *Order Summary:*
// ${itemsList}
//     `.trim()
// }

/**
 * Generates a formatted WhatsApp message for order confirmation, with pagination support.
 * @param order The full order object.
 * @param startIndex The starting index (inclusive) of products to include in this message.
 * @param endIndex The ending index (exclusive) of products to include in this message.
 * If not provided, all products from startIndex to the end of the array are included.
 * @returns A string containing the formatted message.
 */
export function generateOrderConfirmationMessage(
  order: Order,
  startIndex: number = 0,
  endIndex?: number // Optional: specify the end index for slicing products
): string {
  // Slice the products array to get only the relevant products for this message
  const productsToSend = endIndex
    ? order.products.slice(startIndex, endIndex)
    : order.products.slice(startIndex)

  // Format the list of items for the message body
  const itemsList = productsToSend
    .map((p) => {
      // Basic validation for product data
      if (!p || !p.product) {
        return "- Product details missing"
      }

      // Handle unavailable products
      if (p.available === false) {
        return `❌ ${p.product.title} : *N/A*` // Show product as unavailable
      }

      // Format weight and unit if available
      const weight = p.weight ? `${p.weight}${p.unit}` : ""

      // Construct the line for each product
      return `✅ ${p.quantity}x ${
        p.product.title
      } - ${weight} - ${formatCurrency(Number(p.quantityTotal), "GHS")}`
    })
    .join("\n") // Join each product line with a newline

  // Add batch information if multiple messages are expected
  const totalProducts = order.products.length
  let batchInfo = ""
  if (totalProducts > (endIndex || startIndex) || startIndex > 0) {
    // Only show batch info if there are more products than this batch, or if it's not the first batch
    batchInfo = ` (Products ${startIndex + 1}-${Math.min(
      endIndex || totalProducts,
      totalProducts
    )} of ${totalProducts})`
  }

  // Construct the final message
  return `
Below is the complete list of products for Order #${order?.orderNumber}${batchInfo}

*Order Summary:*
${itemsList}
    `.trim() // .trim() removes leading/trailing whitespace
}
