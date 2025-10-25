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

// Helper function to determine batch boundaries that respect brand grouping
// export function calculateBrandAwareBatches(
//   order: Order,
//   maxProductsPerBatch: number = 30
// ): { startIndex: number; endIndex: number }[] {
//   const UNKNOWN_BRAND = "OTHER"

//   const normalizeBrand = (raw: unknown): string => {
//     if (typeof raw === "string") {
//       const s = raw.trim()
//       return s ? s : UNKNOWN_BRAND
//     }
//     if (raw != null && typeof (raw as any).toString === "function") {
//       const s = (raw as any).toString().trim()
//       return s ? s : UNKNOWN_BRAND
//     }
//     return UNKNOWN_BRAND
//   }

//   // Create an array of products with their brand info
//   const productsWithBrands = order.products.map((product, index) => ({
//     product,
//     brand: normalizeBrand(product?.product?.partner?.brand),
//     index,
//   }))

//   // Group consecutive products by brand to find brand boundaries
//   const brandGroups: { brand: string; startIndex: number; endIndex: number }[] =
//     []
//   let currentBrand = productsWithBrands[0]?.brand
//   let currentStart = 0

//   for (let i = 0; i < productsWithBrands.length; i++) {
//     const brand = productsWithBrands[i].brand

//     // If brand changes, save the previous group
//     if (brand !== currentBrand) {
//       brandGroups.push({
//         brand: currentBrand,
//         startIndex: currentStart,
//         endIndex: i,
//       })
//       currentBrand = brand
//       currentStart = i
//     }
//   }

//   // Add the last group
//   if (productsWithBrands.length > 0) {
//     brandGroups.push({
//       brand: currentBrand,
//       startIndex: currentStart,
//       endIndex: productsWithBrands.length,
//     })
//   }

//   // Now create batches that respect brand boundaries
//   const batches: { startIndex: number; endIndex: number }[] = []
//   let batchStart = 0
//   let currentBatchSize = 0

//   for (const group of brandGroups) {
//     const groupSize = group.endIndex - group.startIndex

//     // If adding this brand would exceed max AND we already have items in the batch
//     if (
//       currentBatchSize > 0 &&
//       currentBatchSize + groupSize > maxProductsPerBatch
//     ) {
//       // Close current batch
//       batches.push({
//         startIndex: batchStart,
//         endIndex: group.startIndex,
//       })

//       // Start new batch with this brand
//       batchStart = group.startIndex
//       currentBatchSize = groupSize
//     } else {
//       // Add this brand to current batch
//       currentBatchSize += groupSize
//     }
//   }

//   // Add the final batch
//   if (currentBatchSize > 0) {
//     batches.push({
//       startIndex: batchStart,
//       endIndex: order.products.length,
//     })
//   }

//   return batches
// }

function estimateMessageLength(
  products: any[],
  orderNumber: string,
  totalProducts: number,
  startIndex: number,
  endIndex: number,
  isLastBatch: boolean,
  deliveryFee: number = 0,
  total: number = 0,
  updatedOrderTotal: number = 0
): number {
  const UNKNOWN_BRAND = "OTHER"

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

  // Header
  let length =
    `Below is the complete list of products for Order #${orderNumber} (Items ${startIndex + 1}-${endIndex} of ${totalProducts})\n\n*Order Summary:*\n`
      .length

  // Group by brand and estimate
  const grouped: Record<string, any[]> = {}
  products.forEach((p) => {
    const brand = normalizeBrand(p?.product?.partner?.brand)
    if (!grouped[brand]) grouped[brand] = []
    grouped[brand].push(p)
  })

  // Add brand headers and products
  Object.keys(grouped).forEach((brand) => {
    length += `\n*${brand}*\n`.length
    grouped[brand].forEach((p) => {
      const weight = p.weight ? `${p.weight}${p.unit ?? ""} ` : ""
      const line = `✅ ${p.quantity}x ${weight}${p.product?.title || "Unknown"} - GHS ${Number(p.quantityTotal || 0).toFixed(2)}\n`
      length += line.length
    })
  })

  // Add totals if last batch
  if (isLastBatch) {
    length += `\n━━━━━━━━━━━━━━━━\n`.length
    length += `Subtotal: GHS ${total.toFixed(2)}\n`.length
    length += `Delivery Fee: GHS ${deliveryFee.toFixed(2)}\n`.length
    length += `*Total: GHS ${updatedOrderTotal.toFixed(2)}*\n`.length
    length += `\n_Thank you for your order!_ 🙏`.length
  }

  return length
}

// export function calculateBrandAwareBatches(
//   order: Order,
//   maxProductsPerBatch: number = 30
// ): { startIndex: number; endIndex: number }[] {
//   const UNKNOWN_BRAND = "OTHER"

//   const normalizeBrand = (raw: unknown): string => {
//     if (typeof raw === "string") {
//       const s = raw.trim()
//       return s ? s : UNKNOWN_BRAND
//     }
//     if (raw != null && typeof (raw as any).toString === "function") {
//       const s = (raw as any).toString().trim()
//       return s ? s : UNKNOWN_BRAND
//     }
//     return UNKNOWN_BRAND
//   }

//   // STEP 1: Sort all products by brand (alphabetically, with OTHER last)
//   const sortedProducts = [...order.products].sort((a, b) => {
//     const brandA = normalizeBrand(a?.product?.partner?.brand)
//     const brandB = normalizeBrand(b?.product?.partner?.brand)

//     // Put OTHER brand last
//     if (brandA === UNKNOWN_BRAND && brandB !== UNKNOWN_BRAND) return 1
//     if (brandA !== UNKNOWN_BRAND && brandB === UNKNOWN_BRAND) return -1

//     // Sort other brands alphabetically
//     return brandA.localeCompare(brandB)
//   })

//   // Update the order object with sorted products
//   order.products = sortedProducts

//   // STEP 2: Find brand group boundaries in sorted array
//   const brandGroups: { brand: string; startIndex: number; endIndex: number }[] =
//     []

//   if (sortedProducts.length === 0) {
//     return []
//   }

//   let currentBrand = normalizeBrand(sortedProducts[0]?.product?.partner?.brand)
//   let currentStart = 0

//   for (let i = 1; i < sortedProducts.length; i++) {
//     const brand = normalizeBrand(sortedProducts[i]?.product?.partner?.brand)

//     if (brand !== currentBrand) {
//       brandGroups.push({
//         brand: currentBrand,
//         startIndex: currentStart,
//         endIndex: i,
//       })
//       currentBrand = brand
//       currentStart = i
//     }
//   }

//   // Add the last group
//   brandGroups.push({
//     brand: currentBrand,
//     startIndex: currentStart,
//     endIndex: sortedProducts.length,
//   })

//   // STEP 3: Create batches that don't split brands
//   const batches: { startIndex: number; endIndex: number }[] = []
//   let batchStart = 0
//   let currentBatchSize = 0

//   for (const group of brandGroups) {
//     const groupSize = group.endIndex - group.startIndex

//     // If adding this brand exceeds max AND we have items already
//     if (
//       currentBatchSize > 0 &&
//       currentBatchSize + groupSize > maxProductsPerBatch
//     ) {
//       // Close current batch
//       batches.push({
//         startIndex: batchStart,
//         endIndex: group.startIndex,
//       })

//       // Start new batch with this brand
//       batchStart = group.startIndex
//       currentBatchSize = groupSize
//     } else {
//       // Add brand to current batch
//       currentBatchSize += groupSize
//     }
//   }

//   // Add final batch
//   if (currentBatchSize > 0) {
//     batches.push({
//       startIndex: batchStart,
//       endIndex: sortedProducts.length,
//     })
//   }

//   return batches
// }

export function calculateBrandAwareBatches(
  order: Order,
  maxProductsPerBatch: number = 30,
  maxCharsPerMessage: number = 1400 // Safe limit under 1600
): { startIndex: number; endIndex: number }[] {
  const UNKNOWN_BRAND = "OTHER"

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

  // Sort products by brand
  const sortedProducts = [...order.products].sort((a, b) => {
    const brandA = normalizeBrand(a?.product?.partner?.brand)
    const brandB = normalizeBrand(b?.product?.partner?.brand)

    if (brandA === UNKNOWN_BRAND && brandB !== UNKNOWN_BRAND) return 1
    if (brandA !== UNKNOWN_BRAND && brandB === UNKNOWN_BRAND) return -1

    return brandA.localeCompare(brandB)
  })

  order.products = sortedProducts

  if (sortedProducts.length === 0) return []

  // Find brand boundaries
  const brandGroups: { brand: string; startIndex: number; endIndex: number }[] =
    []
  let currentBrand = normalizeBrand(sortedProducts[0]?.product?.partner?.brand)
  let currentStart = 0

  for (let i = 1; i < sortedProducts.length; i++) {
    const brand = normalizeBrand(sortedProducts[i]?.product?.partner?.brand)
    if (brand !== currentBrand) {
      brandGroups.push({
        brand: currentBrand,
        startIndex: currentStart,
        endIndex: i,
      })
      currentBrand = brand
      currentStart = i
    }
  }
  brandGroups.push({
    brand: currentBrand,
    startIndex: currentStart,
    endIndex: sortedProducts.length,
  })

  // Create character-aware batches
  const batches: { startIndex: number; endIndex: number }[] = []
  let batchStart = 0
  let currentBatchProducts: any[] = []

  for (const group of brandGroups) {
    const groupProducts = sortedProducts.slice(group.startIndex, group.endIndex)

    // Try adding entire brand to current batch
    const testProducts = [...currentBatchProducts, ...groupProducts]
    const testLength = estimateMessageLength(
      testProducts,
      order.orderNumber,
      sortedProducts.length,
      batchStart,
      batchStart + testProducts.length,
      batchStart + testProducts.length >= sortedProducts.length,
      order.deliveryFee ?? 0,
      order.total,
      order.updatedOrderTotal
    )

    // If it fits and doesn't exceed product limit, add it
    if (
      testLength <= maxCharsPerMessage &&
      testProducts.length <= maxProductsPerBatch
    ) {
      currentBatchProducts = testProducts
    }
    // If current batch has products, close it and start new one
    else if (currentBatchProducts.length > 0) {
      batches.push({
        startIndex: batchStart,
        endIndex: batchStart + currentBatchProducts.length,
      })
      batchStart = batchStart + currentBatchProducts.length
      currentBatchProducts = []

      // Try adding brand to new batch (may need splitting if brand is huge)
      let brandStart = 0
      while (brandStart < groupProducts.length) {
        const tempProducts = [groupProducts[brandStart]]
        let tempLength = estimateMessageLength(
          tempProducts,
          order.orderNumber,
          sortedProducts.length,
          batchStart,
          batchStart + tempProducts.length,
          batchStart + tempProducts.length >= sortedProducts.length,
          order.deliveryFee ?? 0,
          order.total,
          order.updatedOrderTotal
        )

        // Keep adding products from same brand until limit
        while (
          brandStart + tempProducts.length < groupProducts.length &&
          tempProducts.length < maxProductsPerBatch
        ) {
          const nextProduct = groupProducts[brandStart + tempProducts.length]
          const testTemp = [...tempProducts, nextProduct]
          const testTempLength = estimateMessageLength(
            testTemp,
            order.orderNumber,
            sortedProducts.length,
            batchStart,
            batchStart + testTemp.length,
            batchStart + testTemp.length >= sortedProducts.length,
            order.deliveryFee ?? 0,
            order.total,
            order.updatedOrderTotal
          )

          if (testTempLength > maxCharsPerMessage) break

          tempProducts.push(nextProduct)
          tempLength = testTempLength
        }

        currentBatchProducts = tempProducts
        brandStart += tempProducts.length

        // If more products in this brand, close current batch
        if (brandStart < groupProducts.length) {
          batches.push({
            startIndex: batchStart,
            endIndex: batchStart + currentBatchProducts.length,
          })
          batchStart = batchStart + currentBatchProducts.length
          currentBatchProducts = []
        }
      }
    }
    // Edge case: first brand in batch is too large
    else {
      let brandStart = 0
      while (brandStart < groupProducts.length) {
        const tempProducts = [groupProducts[brandStart]]

        while (
          brandStart + tempProducts.length < groupProducts.length &&
          tempProducts.length < maxProductsPerBatch
        ) {
          const testTemp = [
            ...tempProducts,
            groupProducts[brandStart + tempProducts.length],
          ]
          const testLength = estimateMessageLength(
            testTemp,
            order.orderNumber,
            sortedProducts.length,
            batchStart,
            batchStart + testTemp.length,
            batchStart + testTemp.length >= sortedProducts.length,
            order.deliveryFee ?? 0,
            order.total,
            order.updatedOrderTotal
          )

          if (testLength > maxCharsPerMessage) break
          tempProducts.push(groupProducts[brandStart + tempProducts.length])
        }

        batches.push({
          startIndex: batchStart,
          endIndex: batchStart + tempProducts.length,
        })

        batchStart += tempProducts.length
        brandStart += tempProducts.length
      }
    }
  }

  // Add final batch if exists
  if (currentBatchProducts.length > 0) {
    batches.push({
      startIndex: batchStart,
      endIndex: batchStart + currentBatchProducts.length,
    })
  }

  return batches
}

// Modified main function
export function generateOrderConfirmationMessage(
  order: Order,
  startIndex: number = 0,
  endIndex?: number
): string {
  // Slice the products array to get only the relevant products for this message
  const productsToSend = endIndex
    ? order.products.slice(startIndex, endIndex)
    : order.products.slice(startIndex)

  const UNKNOWN_BRAND = "OTHER"

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

  // Group products by partner brand
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

  // Build the items list grouped by partner
  let itemsList = ""

  for (const brand of sortedBrands) {
    const header =
      brand === UNKNOWN_BRAND ? UNKNOWN_BRAND : capitalizeBrand(brand)
    itemsList += `\n*${header}*\n`

    const partnerProducts = groupedByPartner[brand]

    partnerProducts.forEach((p) => {
      if (!p || !p.product) {
        itemsList += "- Product details missing\n"
        return
      }

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

// export function generateOrderConfirmationMessage(
//   order: Order,
//   startIndex: number = 0,
//   endIndex?: number
// ): string {
//   // Slice the products array to get only the relevant products for this message
//   const productsToSend = endIndex
//     ? order.products.slice(startIndex, endIndex)
//     : order.products.slice(startIndex)

//   const UNKNOWN_BRAND = "OTHER"

//   const normalizeBrand = (raw: unknown): string => {
//     if (typeof raw === "string") {
//       const s = raw.trim()
//       return s ? s : UNKNOWN_BRAND
//     }
//     if (raw != null && typeof (raw as any).toString === "function") {
//       const s = (raw as any).toString().trim()
//       return s ? s : UNKNOWN_BRAND
//     }
//     return UNKNOWN_BRAND
//   }

//   const capitalizeBrand = (brandName: string): string =>
//     brandName
//       .toLowerCase()
//       .split(" ")
//       .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
//       .join(" ")

//   // Group products by partner brand (robust fallback to Unknown Partner)
//   const groupedByPartner = productsToSend.reduce(
//     (acc, product) => {
//       const brand = normalizeBrand(product?.product?.partner?.brand)
//       if (!acc[brand]) acc[brand] = []
//       acc[brand].push(product)
//       return acc
//     },
//     {} as Record<string, typeof productsToSend>
//   )

//   // Sort partner brands: known A→Z, Unknown Partner last if present
//   const brands = Object.keys(groupedByPartner)
//   const knownBrands = brands
//     .filter((b) => b !== UNKNOWN_BRAND)
//     .sort((a, b) => a.localeCompare(b))
//   const includeUnknown = brands.includes(UNKNOWN_BRAND)
//   const sortedBrands = includeUnknown
//     ? [...knownBrands, UNKNOWN_BRAND]
//     : knownBrands

//   // Build the items list grouped by partner (now includes Unknown Partner header)
//   let itemsList = ""

//   for (const brand of sortedBrands) {
//     const header =
//       brand === UNKNOWN_BRAND ? UNKNOWN_BRAND : capitalizeBrand(brand)
//     itemsList += `\n*${header}*\n`

//     const partnerProducts = groupedByPartner[brand]

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

//       const weight = p.weight ? `${p.weight}${p.unit ?? ""} ` : ""
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
//     message += `\n_Thank you for your order!_ 🙏`
//   }

//   return message.trim()
// }
