import { Order } from "@/types"

/**
 * Generates a formatted WhatsApp message for order confirmation, with pagination support.
 * @param order The full order object.
 * @param startIndex The starting index (inclusive) of products to include in this message.
 * @param endIndex The ending index (exclusive) of products to include in this message.
 * If not provided, all products from startIndex to the end of the array are included.
 * @returns A string containing the formatted message.
 */
// export function generateOrderConfirmationMessage(
//   order: Order,
//   startIndex: number = 0,
//   endIndex?: number // Optional: specify the end index for slicing products
// ): string {
//   // Slice the products array to get only the relevant products for this message
//   const productsToSend = endIndex
//     ? order.products.slice(startIndex, endIndex)
//     : order.products.slice(startIndex)

//   // Format the list of items for the message body
//   const itemsList = productsToSend
//     .map((p) => {
//       // Basic validation for product data
//       if (!p || !p.product) {
//         return "- Product details missing"
//       }

//       // Handle unavailable products
//       if (p.available === false) {
//         return `❌ ${p.product.title} : *N/A*` // Show product as unavailable
//       }

//       // Format weight and unit if available
//       const weight = p.weight ? `${p.weight}${p.unit}` : ""

//       // Construct the line for each product
//       return `✅ ${p.quantity}x ${
//         p.product.title
//       } - ${weight} - ${formatCurrency(Number(p.quantityTotal), "GHS")}`
//     })
//     .join("\n") // Join each product line with a newline

//   // Add batch information if multiple messages are expected
//   const totalProducts = order.products.length
//   let batchInfo = ""
//   if (totalProducts > (endIndex || startIndex) || startIndex > 0) {
//     // Only show batch info if there are more products than this batch, or if it's not the first batch
//     batchInfo = ` (Products ${startIndex + 1}-${Math.min(
//       endIndex || totalProducts,
//       totalProducts
//     )} of ${totalProducts})`
//   }

//   // Construct the final message
//   return `
// Below is the complete list of products for Order #${order?.orderNumber}${batchInfo}

// *Order Summary:*
// ${itemsList}
//     `.trim() // .trim() removes leading/trailing whitespace
// }

// Helper function to format currency
const formatCurrency = (amount: number, currency: string = "GHS"): string => {
  return `${currency} ${amount.toFixed(2)}`
}

const capitalizeBrand = (brandName: string): string => {
  return brandName
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// export function generateOrderConfirmationMessage(
//   order: Order,
//   startIndex: number = 0,
//   endIndex?: number
// ): string {
//   // Slice the products array to get only the relevant products for this message
//   const productsToSend = endIndex
//     ? order.products.slice(startIndex, endIndex)
//     : order.products.slice(startIndex)

//   // Group products by partner brand
//   const groupedByPartner = productsToSend.reduce(
//     (acc, product) => {
//       // Handle missing product data
//       if (!product || !product.product || !product.product.partner) {
//         if (!acc["Unknown"]) {
//           acc["Unknown"] = []
//         }
//         acc["Unknown"].push(product)
//         return acc
//       }

//       const brand = product.product.partner.brand
//       if (!acc[brand]) {
//         acc[brand] = []
//       }
//       acc[brand].push(product)
//       return acc
//     },
//     {} as Record<string, typeof productsToSend>
//   )

//   // Sort partner brands alphabetically
//   const sortedBrands = Object.keys(groupedByPartner).sort()

//   // Build the items list grouped by partner
//   let itemsList = ""

//   for (const brand of sortedBrands) {
//     const partnerProducts = groupedByPartner[brand]

//     // Add brand header (skip for "Unknown")
//     if (brand !== "Unknown") {
//       const brandName = capitalizeBrand(brand)
//       itemsList += `\n*${brandName}*\n`
//     }

//     // Add products under this brand
//     partnerProducts.forEach((p) => {
//       // Basic validation for product data
//       if (!p || !p.product) {
//         itemsList += "- Product details missing\n"
//         return
//       }

//       // Handle unavailable products
//       if (p.available === false) {
//         itemsList += `❌ ${p.product.title} : *N/A*\n`
//         return
//       }

//       // Format weight and unit if available
//       const weight = p.weight ? `${p.weight}${p.unit} ` : ""

//       // Construct the line for each product
//       itemsList += `✅ ${p.quantity}x ${weight}${p.product.title} - ${formatCurrency(
//         Number(p.quantityTotal),
//         "GHS"
//       )}\n`
//     })
//   }

//   // Add batch information if multiple messages are expected
//   const totalProducts = order.products.length
//   const actualEndIndex = endIndex || totalProducts
//   let batchInfo = ""

//   if (totalProducts > actualEndIndex || startIndex > 0) {
//     batchInfo = ` (Items ${startIndex + 1}-${actualEndIndex} of ${totalProducts})`
//   }

//   // Build the final message
//   let message = `Below is the complete list of products for Order #${order.orderNumber}${batchInfo}\n`
//   message += `\n*Order Summary:*${itemsList}`

//   // Add order totals only on the last message
//   if (!endIndex || endIndex >= totalProducts) {
//     message += `\n━━━━━━━━━━━━━━━━\n`
//     message += `Subtotal: ${formatCurrency(order.total)}\n`
//     message += `Delivery Fee: ${formatCurrency(order.deliveryFee ?? 0)}\n`
//     message += `*Total: ${formatCurrency(order.updatedOrderTotal)}*\n`

//     // Add delivery information
//     // if (order.deliveryDate) {
//     //   message += `\n📅 Delivery: ${order.deliveryDate}\n`
//     // }
//     // if (order.shippingAddress?.deliveryMethod) {
//     //   message += `🚚 ${order.shippingAddress.deliveryMethod}\n`
//     // }

//     // // Add payment info
//     // if (order.paymentMode) {
//     //   const paymentLabel =
//     //     order.paymentMode === "cash" ? "Cash on Delivery" : order.paymentMode
//     //   message += `💳 Payment: ${paymentLabel}\n`
//     // }

//     message += `\n_Thank you for your order!_ 🙏`
//   }

//   return message.trim()
// }

export function generateOrderConfirmationMessage(
  order: Order,
  startIndex: number = 0,
  endIndex?: number
): string {
  // Slice the products array to get only the relevant products for this message
  const productsToSend = endIndex
    ? order.products.slice(startIndex, endIndex)
    : order.products.slice(startIndex)

  // Helpers
  const UNKNOWN_BRAND = "Unknown Partner"

  const normalizeBrand = (raw: unknown): string => {
    if (typeof raw === "string") {
      const s = raw.trim()
      return s ? s : UNKNOWN_BRAND
    }
    if (raw != null && typeof (raw as any).toString === "function") {
      const s = (raw as any).toString().trim()
      return s ? s : UNKNOWN_BRAND
    }
    return UNKNOWN_BRAND
  }

  const capitalizeBrand = (brandName: string): string =>
    brandName
      .toLowerCase()
      .split(" ")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ")

  // Group products by partner brand (robust fallback to Unknown Partner)
  const groupedByPartner = productsToSend.reduce(
    (acc, product) => {
      const brand = normalizeBrand(product?.product?.partner?.brand)
      if (!acc[brand]) acc[brand] = []
      acc[brand].push(product)
      return acc
    },
    {} as Record<string, typeof productsToSend>
  )

  // Sort partner brands: known A→Z, Unknown Partner last if present
  const brands = Object.keys(groupedByPartner)
  const knownBrands = brands
    .filter((b) => b !== UNKNOWN_BRAND)
    .sort((a, b) => a.localeCompare(b))
  const includeUnknown = brands.includes(UNKNOWN_BRAND)
  const sortedBrands = includeUnknown
    ? [...knownBrands, UNKNOWN_BRAND]
    : knownBrands

  // Build the items list grouped by partner (now includes Unknown Partner header)
  let itemsList = ""

  for (const brand of sortedBrands) {
    const header =
      brand === UNKNOWN_BRAND ? UNKNOWN_BRAND : capitalizeBrand(brand)
    itemsList += `\n*${header}*\n`

    const partnerProducts = groupedByPartner[brand]

    partnerProducts.forEach((p) => {
      // Basic validation for product data
      if (!p || !p.product) {
        itemsList += "- Product details missing\n"
        return
      }

      // Handle unavailable products
      if (p.available === false) {
        itemsList += `❌ ${p.product.title} : *N/A*\n`
        return
      }

      const weight = p.weight ? `${p.weight}${p.unit ?? ""} ` : ""
      itemsList += `✅ ${p.quantity}x ${weight}${p.product.title} - ${formatCurrency(
        Number(p.quantityTotal),
        "GHS"
      )}\n`
    })
  }

  // Add batch information if multiple messages are expected
  const totalProducts = order.products.length
  const actualEndIndex = endIndex || totalProducts
  let batchInfo = ""

  if (totalProducts > actualEndIndex || startIndex > 0) {
    batchInfo = ` (Items ${startIndex + 1}-${actualEndIndex} of ${totalProducts})`
  }

  // Build the final message
  let message = `Below is the complete list of products for Order #${order.orderNumber}${batchInfo}\n`
  message += `\n*Order Summary:*${itemsList}`

  // Add order totals only on the last message
  if (!endIndex || endIndex >= totalProducts) {
    message += `\n━━━━━━━━━━━━━━━━\n`
    message += `Subtotal: ${formatCurrency(order.total)}\n`
    message += `Delivery Fee: ${formatCurrency(order.deliveryFee ?? 0)}\n`
    message += `*Total: ${formatCurrency(order.updatedOrderTotal)}*\n`
    message += `\n_Thank you for your order!_ 🙏`
  }

  return message.trim()
}
