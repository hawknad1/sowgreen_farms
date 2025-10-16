import { formatProductLine } from "./formatProductLine"
import { truncate } from "./truncate"
import { formatCurrency } from "../utils"
import { ProductOrder, Staff } from "@/types"
import { capitalizeName } from "../capitalizeName"

interface Product {
  quantity: number
  quantityTotal: number
  available: boolean
  weight?: number
  unit?: string
  product: {
    title: string
    partner?: {
      brand: string
    }
  }
}

interface ShippingAddress {
  name: string
  address: string
  city: string
  region: string
  phone: string
  deliveryMethod?: string
}

interface Order {
  shippingAddress: ShippingAddress
  orderNumber: string
  deliveryDate: string
  products: Product[]
  total: number
  deliveryFee: number
  dispatchRider: {
    fullName: string
    phone: string
  }
  updatedOrderTotal: number
  creditAppliedTotal: number
  userWhatsappOptIn: {
    customerPhone: string
  }
}

// export function prepareOrderDetails(
//   order: Order,
//   shipping: ShippingAddress,
//   maxProducts: number,
//   workers: Staff[]
// ) {
//   // Prepare worker contact info using passed workers
//   const worker_one = workers[0]
//     ? `${capitalizeName(workers[0]?.fullName?.split(" ")[0])}: ${
//         workers[0]?.phone
//       }`
//     : ""
//   const worker_two = workers[1]
//     ? `${capitalizeName(workers[1]?.fullName?.split(" ")[0])}: ${
//         workers[1]?.phone
//       }`
//     : ""

//   const deliveryMethod = (shipping.deliveryMethod || "Pickup").trim()

//   const displayMethod = deliveryMethod.includes("Home Delivery")
//     ? deliveryMethod
//     : `Pickup @ ${deliveryMethod}`

//   // 1. Base information with minimal truncation
//   const baseVariables = [
//     shipping.name?.split(" ")[0],
//     order.orderNumber,
//     order.deliveryDate?.split(",").slice(0, 2).join(","),
//     displayMethod,
//     `${shipping.address}, ${shipping.city}`,
//     order?.dispatchRider?.fullName || "Not Assigned",
//     shipping.phone,
//   ]

//   // Helper function to capitalize brand name
//   const capitalizeBrand = (brandName: string): string => {
//     return brandName
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ")
//   }

//   // 2. Product handling with partner grouping
//   const allProducts = order.products

//   // Group products by partner brand
//   const groupedByPartner = allProducts.reduce(
//     (acc, product) => {
//       const brand = product.product.partner.brand
//       if (!acc[brand]) {
//         acc[brand] = []
//       }
//       acc[brand].push(product)
//       return acc
//     },
//     {} as Record<string, typeof allProducts>
//   )

//   // Sort partner brands alphabetically
//   const sortedBrands = Object.keys(groupedByPartner).sort()

//   // Format products grouped by partner
//   let productLines: string[] = []

//   for (const brand of sortedBrands) {
//     const products = groupedByPartner[brand]
//     const brandName = capitalizeBrand(brand)

//     // Add brand header
//     productLines.push(`*${brandName}*`)

//     // Add products under this brand using formatProductLine
//     products.forEach((p) => {
//       const formattedLine = formatProductLine(p, 24)
//       productLines.push(formattedLine)
//     })
//   }

//   // Handle maxProducts limit with partner grouping
//   if (productLines.length > maxProducts) {
//     // If we exceed maxProducts, we need to handle truncation differently
//     // First, count how many products we can show before hitting the limit
//     let currentCount = 0
//     const limitedProductLines: string[] = []

//     for (const line of productLines) {
//       // Check if adding this line would exceed the limit
//       if (currentCount + 1 <= maxProducts) {
//         limitedProductLines.push(line)
//         currentCount++
//       } else {
//         break
//       }
//     }

//     productLines = limitedProductLines
//   } else if (productLines.length < maxProducts) {
//     // Fill remaining slots with empty strings
//     productLines = [
//       ...productLines,
//       ...Array(maxProducts - productLines.length).fill(""),
//     ]
//   }

//   // 3. Compact summary values
//   const summaryValues = [
//     formatCurrency(order.total, "GHS"),
//     formatCurrency(order.deliveryFee ?? 0, "GHS"),
//     formatCurrency(order.creditAppliedTotal, "GHS"),
//     formatCurrency(order.total + (order.deliveryFee ?? 0), "GHS"),
//     formatCurrency(order.updatedOrderTotal, "GHS"),
//   ]

//   // 4. Contact info
//   const contactValues = [` ${worker_one}`, ` ${worker_two}`]

//   return { baseVariables, productLines, summaryValues, contactValues }
// }

export function prepareOrderDetails(
  order: Order,
  shipping: ShippingAddress,
  maxProducts: number, // now treated as a MINIMUM row count (pad-only), not a cap
  workers: Staff[]
) {
  // 0) Worker contact info
  const worker_one = workers[0]
    ? `${capitalizeName(workers[0]?.fullName?.split(" ")[0])}: ${workers[0]?.phone}`
    : ""
  const worker_two = workers[1]
    ? `${capitalizeName(workers[1]?.fullName?.split(" ")[0])}: ${workers[1]?.phone}`
    : ""

  // 1) Delivery method + base variables
  const deliveryMethod = (shipping.deliveryMethod || "Pickup").trim()
  const displayMethod = deliveryMethod.includes("Home Delivery")
    ? deliveryMethod
    : `Pickup @ ${deliveryMethod}`

  const baseVariables = [
    shipping.name?.split(" ")[0],
    order.orderNumber,
    order.deliveryDate?.split(",").slice(0, 2).join(","),
    displayMethod,
    `${shipping.address}, ${shipping.city}`,
    order?.dispatchRider?.fullName || "Not Assigned",
    shipping.phone,
  ]

  // 2) Helpers
  const capitalizeBrand = (brandName: string): string => {
    return brandName
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

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

  // 3) Group products by normalized partner brand
  const allProducts = order.products
  const groupedByPartner = allProducts.reduce(
    (acc, product) => {
      const brand = normalizeBrand(product?.product?.partner?.brand)
      if (!acc[brand]) acc[brand] = []
      acc[brand].push(product)
      return acc
    },
    {} as Record<string, typeof allProducts>
  )

  // 4) Sort brands: known brands A→Z, then Unknown last
  const brands = Object.keys(groupedByPartner)
  const knownBrands = brands
    .filter((b) => b !== UNKNOWN_BRAND)
    .sort((a, b) => a.localeCompare(b))
  const includeUnknown = brands.includes(UNKNOWN_BRAND)
  const sortedBrands = includeUnknown
    ? [...knownBrands, UNKNOWN_BRAND]
    : knownBrands

  // 5) Build product lines with brand headers (no truncation)
  let productLines: string[] = []
  for (const brand of sortedBrands) {
    const header =
      brand === UNKNOWN_BRAND ? UNKNOWN_BRAND : capitalizeBrand(brand)
    productLines.push(`*${header}*`)
    groupedByPartner[brand].forEach((p) => {
      const formattedLine = formatProductLine(p, 24)
      productLines.push(formattedLine || "—")
    })
  }

  // 6) Only pad up to maxProducts; NEVER slice/truncate
  if (
    Number.isFinite(maxProducts) &&
    maxProducts > 0 &&
    productLines.length < maxProducts
  ) {
    productLines = [
      ...productLines,
      ...Array(maxProducts - productLines.length).fill(""),
    ]
  }

  // 7) Summary values
  const summaryValues = [
    formatCurrency(order.total, "GHS"),
    formatCurrency(order.deliveryFee ?? 0, "GHS"),
    formatCurrency(order.creditAppliedTotal, "GHS"),
    formatCurrency(order.total + (order.deliveryFee ?? 0), "GHS"),
    formatCurrency(order.updatedOrderTotal, "GHS"),
  ]

  // 8) Contacts
  const contactValues = [` ${worker_one}`, ` ${worker_two}`]

  return { baseVariables, productLines, summaryValues, contactValues }
}

export function prepareOrderPickupDetails(
  order: Order,
  shipping: ShippingAddress,
  maxProducts: number,
  workers: Staff[]
) {
  // Prepare worker contact info using passed workers
  const worker_one = workers[0]
    ? `${capitalizeName(workers[0]?.fullName?.split(" ")[0])}: ${
        workers[0]?.phone
      }`
    : ""
  const worker_two = workers[1]
    ? `${capitalizeName(workers[1]?.fullName?.split(" ")[0])}: ${
        workers[1]?.phone
      }`
    : ""

  // 1. Base information - REDUCED TO 5 VARIABLES
  const baseVariables = [
    shipping.name?.split(" ")[0],
    order.orderNumber,
    order.deliveryDate?.split(",").slice(0, 2).join(","),
    order.shippingAddress.deliveryMethod,
    shipping.phone,
  ]

  // // Helper function to capitalize brand name
  // const capitalizeBrand = (brandName: string): string => {
  //   return brandName
  //     .toLowerCase()
  //     .split(" ")
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(" ")
  // }

  // // 2. Product handling with partner grouping
  // const allProducts = order.products

  // // Group products by partner brand
  // const groupedByPartner = allProducts.reduce(
  //   (acc, product) => {
  //     const brand = product.product.partner.brand || "Unknown Vendor"
  //     if (!acc[brand]) {
  //       acc[brand] = []
  //     }
  //     acc[brand].push(product)
  //     return acc
  //   },
  //   {} as Record<string, typeof allProducts>
  // )

  // // Sort partner brands alphabetically
  // const sortedBrands = Object.keys(groupedByPartner).sort()

  // // Format products grouped by partner using the formatProductLine function
  // let productLines: string[] = []

  // for (const brand of sortedBrands) {
  //   const products = groupedByPartner[brand]
  //   const brandName = capitalizeBrand(brand)

  //   // Add brand header
  //   productLines.push(`*${brandName}*`)

  //   // Add products under this brand using formatProductLine
  //   products.forEach((p) => {
  //     const formattedLine = formatProductLine(p)
  //     productLines.push(formattedLine)
  //   })
  // }

  // // Handle maxProducts limit if needed
  // if (productLines.length < maxProducts) {
  //   productLines = [
  //     ...productLines,
  //     ...Array(maxProducts - productLines.length).fill(""),
  //   ]
  // } else if (productLines.length > maxProducts) {
  //   // Truncate if exceeding limit
  //   productLines = productLines.slice(0, maxProducts)
  // }

  // // 3. Compact summary values
  // const summaryValues = [
  //   formatCurrency(order.total, "GHS"),
  //   formatCurrency(order.deliveryFee ?? 0, "GHS"),
  //   formatCurrency(order.creditAppliedTotal, "GHS"),
  //   formatCurrency(order.total + (order.deliveryFee ?? 0), "GHS"),
  //   formatCurrency(order.updatedOrderTotal, "GHS"),
  // ]

  // 2) Helpers
  const capitalizeBrand = (brandName: string): string => {
    return brandName
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

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

  // 3) Group products by normalized partner brand
  const allProducts = order.products
  const groupedByPartner = allProducts.reduce(
    (acc, product) => {
      const brand = normalizeBrand(product?.product?.partner?.brand)
      if (!acc[brand]) acc[brand] = []
      acc[brand].push(product)
      return acc
    },
    {} as Record<string, typeof allProducts>
  )

  // 4) Sort brands: known brands A→Z, then Unknown last
  const brands = Object.keys(groupedByPartner)
  const knownBrands = brands
    .filter((b) => b !== UNKNOWN_BRAND)
    .sort((a, b) => a.localeCompare(b))
  const includeUnknown = brands.includes(UNKNOWN_BRAND)
  const sortedBrands = includeUnknown
    ? [...knownBrands, UNKNOWN_BRAND]
    : knownBrands

  // 5) Build product lines with brand headers (no truncation)
  let productLines: string[] = []
  for (const brand of sortedBrands) {
    const header =
      brand === UNKNOWN_BRAND ? UNKNOWN_BRAND : capitalizeBrand(brand)
    productLines.push(`*${header}*`)
    groupedByPartner[brand].forEach((p) => {
      const formattedLine = formatProductLine(p, 24)
      productLines.push(formattedLine || "—")
    })
  }

  // 6) Only pad up to maxProducts; NEVER slice/truncate
  if (
    Number.isFinite(maxProducts) &&
    maxProducts > 0 &&
    productLines.length < maxProducts
  ) {
    productLines = [
      ...productLines,
      ...Array(maxProducts - productLines.length).fill(""),
    ]
  }

  // 7) Summary values
  const summaryValues = [
    formatCurrency(order.total, "GHS"),
    formatCurrency(order.deliveryFee ?? 0, "GHS"),
    formatCurrency(order.creditAppliedTotal, "GHS"),
    formatCurrency(order.total + (order.deliveryFee ?? 0), "GHS"),
    formatCurrency(order.updatedOrderTotal, "GHS"),
  ]

  // 4. Contact info
  const contactValues = [` ${worker_one}`, ` ${worker_two}`]

  return { baseVariables, productLines, summaryValues, contactValues }
}
