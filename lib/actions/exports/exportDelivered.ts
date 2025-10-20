import { formatDate } from "@/lib/formatDate"
import ExcelJS from "exceljs"

// // Fetch products from the API and extract details
// async function fetchProducts() {
//   try {
//     const response = await fetch("/api/products")
//     if (!response.ok) {
//       throw new Error("Failed to fetch products")
//     }
//     const data = await response.json()
//     return data.sort((a: any, b: any) => a.title.localeCompare(b.title)) // Return full product details including price, weight, etc.
//   } catch (error) {
//     console.error("Error fetching products:", error)
//     return [] // Return an empty array if the request fails
//   }
// }

// // Fetch orders from the API
// async function fetchOrders(from?: Date, to?: Date, status?: string) {
//   try {
//     const queryParams = new URLSearchParams()

//     if (from) queryParams.append("from", from.toISOString())
//     if (to) queryParams.append("to", to.toISOString())
//     if (status) queryParams.append("status", status) // Pass the status filter

//     const response = await fetch(`/api/orders?${queryParams.toString()}`)

//     if (!response.ok) {
//       throw new Error(`Failed to fetch orders: ${response.statusText}`)
//     }

//     const data = await response.json()
//     return data // Return full order details
//   } catch (error) {
//     console.error("Error fetching orders:", error)
//     return [] // Return an empty array if the request fails
//   }
// }

// // Current Date
// const currentDate = formatDate(new Date())

// export default async function exportDeliveredSheet(from: Date, to: Date) {
//   const products = await fetchProducts() // Fetch products from the API
//   const orders = await fetchOrders(from, to, "delivered")

//   const workbook = new ExcelJS.Workbook()
//   const worksheet = workbook.addWorksheet("Report")

//   // Row 1: Date and products (product titles)
//   const row1 = [
//     currentDate,
//     ...products.map((product: any) => product.title),
//     "Total Revenue",
//   ]
//   worksheet.addRow(row1)

//   // Set vertical text for row 1 (product headers)
//   worksheet.getRow(1).eachCell((cell) => {
//     cell.alignment = {
//       textRotation: 90,
//       vertical: "middle",
//       horizontal: "center",
//     }
//   })

//   // Highlight the product header columns (C1, E1, G1, etc.) with cream color
//   const creamColor = { argb: "FCE5CD" } // Cream color
//   for (let colIndex = 3; colIndex <= products.length + 1; colIndex += 2) {
//     const cell = worksheet.getCell(1, colIndex)
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: creamColor,
//     }
//   }

//   // Add placeholder "Totals" row
//   const totalsRowData = worksheet.addRow([
//     "Totals",
//     ...products.map(() => 0),
//     0,
//     "Customer Name",
//     "Payment Mode",
//     "Action",
//   ])

//   // Style the totals row
//   totalsRowData.eachCell((cell) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "000000" }, // Black
//     }
//     cell.font = {
//       color: { argb: "FFFFFF" }, // White
//       bold: true,
//     }
//     cell.alignment = {
//       vertical: "middle",
//       horizontal: "center",
//     }
//   })

//   let totalRevenue = 0

//   orders.forEach((order: any) => {
//     const orderNumber = order?.orderNumber
//     const balance = Math.abs(order?.creditAppliedTotal)
//     const paymentAction = order?.paymentAction.toUpperCase()
//     const customerName = order.shippingAddress.name
//       .toLowerCase()
//       .split(" ")
//       .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ")
//     const orderDetails = products.map((product: any) => {
//       const orderProducts = order.products.filter(
//         (o: any) => o.productId === product.id
//       )

//       if (orderProducts.length === 0) return null // If no order for that product, return null

//       let totalQuantity = 0

//       orderProducts.forEach((orderProduct: any) => {
//         if (orderProduct.available === false) return

//         // Check for specific weight, unit, and title conditions
//         if (orderProduct.product.title.toLowerCase().includes("eggs")) {
//           if (orderProduct.price === 4) {
//             totalQuantity += 1 * orderProduct.quantity
//           } else if (orderProduct.price === 108) {
//             totalQuantity += 30 * orderProduct.quantity
//           }
//           return
//         }

//         if (
//           orderProduct.weight === 250 &&
//           orderProduct.unit === "g" &&
//           orderProduct.product.title.toLowerCase().includes("coffee")
//         ) {
//           totalQuantity += orderProduct.quantity
//           return
//         }

//         // If the product has no weight, return the quantity directly
//         if (!orderProduct.weight || orderProduct.weight === 0) {
//           totalQuantity += orderProduct.quantity
//           return
//         }

//         // Check if the product weight is 0, if so, use quantityTotal instead
//         if (orderProduct.unit === "ltr" || orderProduct.unit === "ml") {
//           totalQuantity += orderProduct.quantity
//         } else {
//           // Multiply quantity by product weight to calculate total for that product
//           if (orderProduct.weight > 30) {
//             totalQuantity +=
//               orderProduct.quantity * (orderProduct.weight / 1000)
//           } else {
//             totalQuantity += orderProduct.quantity * orderProduct.weight
//           }
//         }
//       })

//       return totalQuantity > 0 ? totalQuantity : "N/A"
//     })

//     const totalOrderAmount = order.total + order.deliveryFee + balance
//     totalRevenue += totalOrderAmount // Accumulate the total revenue

//     const paymentMode = order?.paymentMode

//     // Add the row with customer name, their order details, and the total
//     worksheet.addRow([
//       orderNumber,
//       ...orderDetails,
//       totalOrderAmount,
//       customerName,
//       paymentMode.toUpperCase(),
//       paymentAction,
//     ])
//   })

//   // Calculate totals dynamically for each product column
//   const totalRows = worksheet.rowCount
//   for (let colIndex = 2; colIndex <= products.length + 1; colIndex++) {
//     let total = 0
//     for (let rowIndex = 3; rowIndex <= totalRows; rowIndex++) {
//       const cellValue = worksheet.getCell(rowIndex, colIndex).value
//       if (typeof cellValue === "number") {
//         total += cellValue
//       }
//     }
//     worksheet.getCell(2, colIndex).value = total
//   }

//   // Add total revenue in the "Totals" row
//   worksheet.getCell(2, products.length + 2).value = totalRevenue // Last column for Total Revenue

//   // Apply gray color to customer name column (A) starting from A3 down
//   const grayColor = { argb: "D3D3D3" } // Light gray color
//   worksheet.getColumn(1).eachCell((cell, rowNumber) => {
//     if (rowNumber >= 3) {
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: grayColor,
//       }
//     }
//   })

//   // Apply gray color to the last cell in each row starting from row 3
//   const lastColumnIndex = products.length + 3 // Last column index (Total Revenue column)
//   for (let rowIndex = 3; rowIndex <= worksheet.rowCount; rowIndex++) {
//     const lastCell = worksheet.getCell(rowIndex, lastColumnIndex)
//     lastCell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: grayColor,
//     }
//   }

//   // Adjust column widths
//   worksheet.columns = [
//     { width: 20 }, // Customer Name Column (A)
//     ...products.map(() => ({ width: 6 })), // Product columns
//     { width: 10 }, // Total Order Amount column
//     { width: 20 }, // Total Order Amount column
//     { width: 20 }, // Total Order Amount column
//     { width: 20 }, // Total Order Amount column
//   ]

//   // Apply cream color pattern to product data starting from C3, E3, G3, etc.
//   for (let colIndex = 3; colIndex <= products.length + 1; colIndex += 2) {
//     for (let rowIndex = 3; rowIndex <= totalRows; rowIndex++) {
//       const cell = worksheet.getCell(rowIndex, colIndex)
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: creamColor,
//       }
//     }
//   }

//   // Apply borders to all cells (including headers and product data)
//   const totalColumns = products.length + 5 // Total number of columns
//   for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
//     for (let colIndex = 1; colIndex <= totalColumns; colIndex++) {
//       const cell = worksheet.getCell(rowIndex, colIndex)
//       cell.border = {
//         top: { style: "thin" },
//         left: { style: "thin" },
//         bottom: { style: "thin" },
//         right: { style: "thin" },
//       }
//     }
//   }

//   // Style paymentMode column with rounded text backgrounds and conditional colors
//   const paymentModeColumnIndex = products.length + 4 // Payment Mode column index
//   for (let rowIndex = 3; rowIndex <= worksheet.rowCount; rowIndex++) {
//     const paymentModeCell = worksheet.getCell(rowIndex, paymentModeColumnIndex)
//     const paymentMode = paymentModeCell.value

//     // Set background color based on payment mode
//     if (paymentMode === "CASH") {
//       paymentModeCell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "DCE9CB" }, // Green with 15% opacity
//       }
//     } else if (paymentMode === "MOMO") {
//       paymentModeCell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "DDEBFF" }, // Red with 15% opacity
//       }
//     } else if (paymentMode === "CARD") {
//       paymentModeCell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "E2E4FA" }, // Red with 15% opacity
//       }
//     }

//     // Simulate rounded corners by adding padding and borders
//     paymentModeCell.alignment = {
//       vertical: "middle",
//       horizontal: "center",
//     }
//     paymentModeCell.border = {
//       top: { style: "thin", color: { argb: "000000" } },
//       left: { style: "thin", color: { argb: "000000" } },
//       bottom: { style: "thin", color: { argb: "000000" } },
//       right: { style: "thin", color: { argb: "000000" } },
//     }
//   }

//   // After adding rows and styling the worksheet
//   worksheet.views = [
//     {
//       state: "frozen",
//       xSplit: 0,
//       ySplit: 2, // Freeze the first 2 rows
//       topLeftCell: "A3", // Optional: starting point after freeze
//       activeCell: "A3", // Optional: initial active cell
//     },
//   ]

//   // Export the workbook
//   const buffer = await workbook.xlsx.writeBuffer()

//   // Trigger file download
//   const blob = new Blob([buffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   })
//   const link = document.createElement("a")
//   link.href = URL.createObjectURL(blob)
//   link.download = `Delivered Orders Export_${currentDate.replace(/\//g, "-")}.xlsx`
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
// }

// Type definitions

// Type definitions
interface Product {
  id: string
  title: string
  [key: string]: any
}

interface OrderProduct {
  productId: string
  quantity: number
  weight?: number
  unit?: string
  price: number
  available?: boolean
  unitsPerPack?: number // Number of units in this variant (e.g., 1 egg or 30 eggs)
  variantName?: string // e.g., "Single", "Crate", "Dozen"
  product: {
    title: string
    unitsPerPack?: number
  }
}

interface Order {
  id: string
  orderNumber: string
  status: string
  deliveryDate?: string // Formatted string like "Wednesday, Jul 16th, 2025"
  createdAt: string
  updatedAt: string
  creditAppliedTotal: number
  paymentAction: string
  paymentMode: string
  total: number
  subtotal: number
  deliveryFee: number
  updatedOrderTotal: number
  products: OrderProduct[]
  shippingAddress: {
    id: string
    name: string
    region: string
    city: string
    address: string
  }
  dispatchRider?: {
    id: string
    fullName: string
    phone: string
  }
  specialNotes?: string
  [key: string]: any
}

// Product-specific configurations for special quantity calculations
const PRODUCT_QUANTITY_CONFIG: Record<
  string,
  {
    keywords: string[] // Array for multiple keyword variations
    variants: Array<{
      priceRange?: { min: number; max: number }
      exactPrice?: number
      weight?: number
      unit?: string
      unitsPerPack: number
      description?: string
    }>
  }
> = {
  eggs: {
    keywords: ["eggs", "egg"],
    variants: [
      {
        priceRange: { min: 0, max: 10 },
        unitsPerPack: 1,
        description: "Single egg or small pack",
      },
      {
        priceRange: { min: 90, max: 120 },
        unitsPerPack: 30,
        description: "Crate (30 eggs)",
      },
    ],
  },
  leafTea: {
    keywords: [
      "leaf tea",
      "tea leaf",
      "leafTea",
      "leaf-tea",
      "tea bitter leaf",
      "tea pawpaw leaf",
    ],
    variants: [
      {
        weight: 30,
        unit: "g",
        unitsPerPack: 1,
        description: "30g Leaf Tea pack",
      },
    ],
  },
  // Add more products as needed
}

// Get units per pack based on product configuration
function getUnitsPerPack(
  productTitle: string,
  price: number,
  orderProduct: OrderProduct
): number | null {
  // First, check if the order product has unitsPerPack metadata
  if (orderProduct.unitsPerPack) {
    return orderProduct.unitsPerPack
  }

  if (orderProduct.product.unitsPerPack) {
    return orderProduct.product.unitsPerPack
  }

  // Fall back to configuration lookup
  const title = productTitle.toLowerCase()
  const { weight, unit } = orderProduct

  // Debug logging for special products
  const isLeafTeaOrEgg =
    title.includes("leaf") || title.includes("tea") || title.includes("egg")
  if (isLeafTeaOrEgg) {
    console.log(`\n🔍 Checking special product: "${productTitle}"`)
    console.log(`   Price: ${price}, Weight: ${weight}, Unit: ${unit}`)
  }

  for (const [productKey, config] of Object.entries(PRODUCT_QUANTITY_CONFIG)) {
    // Check if title matches any of the keywords
    let matchesKeyword = false

    // Special handling for leafTea - check if BOTH "tea" AND "leaf" are in the title
    if (productKey === "leafTea") {
      matchesKeyword = title.includes("tea") && title.includes("leaf")
    } else {
      matchesKeyword = config.keywords.some((keyword) =>
        title.includes(keyword.toLowerCase())
      )
    }

    if (matchesKeyword) {
      if (isLeafTeaOrEgg) {
        console.log(`   ✓ Matched config: ${productKey}`)
      }

      // Find matching variant
      for (const variant of config.variants) {
        let matches = true

        // Check price if specified
        if (variant.exactPrice !== undefined) {
          matches = matches && price === variant.exactPrice
          if (isLeafTeaOrEgg)
            console.log(
              `     Price check (exact=${variant.exactPrice}): ${matches}`
            )
        }
        if (variant.priceRange) {
          const priceMatches =
            price >= variant.priceRange.min && price <= variant.priceRange.max
          matches = matches && priceMatches
          if (isLeafTeaOrEgg)
            console.log(
              `     Price check (range ${variant.priceRange.min}-${variant.priceRange.max}): ${priceMatches}`
            )
        }

        // Check weight if specified
        if (variant.weight !== undefined) {
          const weightMatches = weight === variant.weight
          matches = matches && weightMatches
          if (isLeafTeaOrEgg)
            console.log(
              `     Weight check (${variant.weight}): ${weightMatches} (actual: ${weight})`
            )
        }

        // Check unit if specified
        if (variant.unit !== undefined) {
          const unitMatches = unit === variant.unit
          matches = matches && unitMatches
          if (isLeafTeaOrEgg)
            console.log(
              `     Unit check (${variant.unit}): ${unitMatches} (actual: ${unit})`
            )
        }

        if (matches) {
          if (isLeafTeaOrEgg)
            console.log(
              `   ✅ MATCHED! Using unitsPerPack: ${variant.unitsPerPack}`
            )
          return variant.unitsPerPack
        }
      }

      if (isLeafTeaOrEgg) console.log(`   ❌ No variant matched`)
    }
  }

  if (isLeafTeaOrEgg) console.log(`   ❌ No config matched`)

  return null
}

// Constants
const COLORS = {
  cream: { argb: "FCE5CD" },
  black: { argb: "000000" },
  white: { argb: "FFFFFF" },
  gray: { argb: "D3D3D3" },
  cashGreen: { argb: "DCE9CB" },
  momoBlue: { argb: "DDEBFF" },
  cardPurple: { argb: "E2E4FA" },
} as const

// Fetch products from the API and extract details
async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch("/api/products")
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`)
    }
    const data = await response.json()
    return data.sort((a: Product, b: Product) => a.title.localeCompare(b.title))
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

// Fetch orders from the API
async function fetchOrders(status?: string): Promise<Order[]> {
  try {
    const queryParams = new URLSearchParams()

    // Only filter by status, not by date - we'll filter by deliveryDate client-side
    if (status) queryParams.append("status", status)

    const url = `/api/orders${queryParams.toString() ? "?" + queryParams.toString() : ""}`
    console.log("Fetching orders from:", url)

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(
      `API returned ${data.length} orders with status="${status || "any"}"`
    )
    return data
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

// Parse formatted date string like "Wednesday, Jul 16th, 2025"
function parseDeliveryDate(dateString: string): Date | null {
  try {
    // Remove day of week and ordinal suffixes (st, nd, rd, th)
    const cleanedDate = dateString
      .replace(/^[A-Za-z]+,\s*/, "") // Remove "Wednesday, "
      .replace(/(\d+)(st|nd|rd|th)/, "$1") // Remove ordinal suffixes

    // Parse the cleaned date
    const parsedDate = new Date(cleanedDate)

    // Check if date is valid
    if (isNaN(parsedDate.getTime())) {
      console.error(
        "Invalid date after parsing:",
        cleanedDate,
        "from original:",
        dateString
      )
      return null
    }

    // Normalize to start of day for consistent comparison
    parsedDate.setHours(0, 0, 0, 0)

    return parsedDate
  } catch (error) {
    console.error("Error parsing date:", dateString, error)
    return null
  }
}

// Filter orders by delivery date and status
function filterOrdersByDeliveryDate(
  orders: Order[],
  from: Date,
  to: Date
): Order[] {
  // Normalize input dates to start/end of day in LOCAL timezone
  const fromDate = new Date(from)
  fromDate.setHours(0, 0, 0, 0)

  const toDate = new Date(to)
  toDate.setHours(23, 59, 59, 999)

  console.log("\n=== DATE FILTERING DEBUG ===")
  console.log("Input from date:", from)
  console.log("Input to date:", to)
  console.log(
    "Normalized from date:",
    fromDate.toDateString(),
    "→",
    fromDate.toISOString()
  )
  console.log(
    "Normalized to date:",
    toDate.toDateString(),
    "→",
    toDate.toISOString()
  )
  console.log("From timestamp:", fromDate.getTime())
  console.log("To timestamp:", toDate.getTime())
  console.log("===========================\n")

  const filtered = orders.filter((order, index) => {
    const shouldLog = index < 5 // Log first 5 orders for debugging

    if (shouldLog)
      console.log(
        `\nChecking order ${index + 1}/${orders.length}: ${order.orderNumber}`
      )

    // Ensure order is delivered
    if (order.status !== "delivered") {
      if (shouldLog)
        console.log(`  ✗ Status is "${order.status}", not "delivered"`)
      return false
    }
    if (shouldLog) console.log(`  ✓ Status is "delivered"`)

    // Ensure deliveryDate exists
    if (!order.deliveryDate) {
      if (shouldLog) console.log(`  ✗ No deliveryDate field`)
      return false
    }
    if (shouldLog) console.log(`  ✓ Has deliveryDate: "${order.deliveryDate}"`)

    // Parse the formatted delivery date
    const deliveryDate = parseDeliveryDate(order.deliveryDate)

    if (!deliveryDate) {
      console.warn(`  ✗ Could not parse delivery date: "${order.deliveryDate}"`)
      return false
    }

    // Check if delivery date is within range (inclusive)
    const deliveryTimestamp = deliveryDate.getTime()
    const fromTimestamp = fromDate.getTime()
    const toTimestamp = toDate.getTime()

    const isAfterFrom = deliveryTimestamp >= fromTimestamp
    const isBeforeTo = deliveryTimestamp <= toTimestamp
    const isInRange = isAfterFrom && isBeforeTo

    if (shouldLog || !isInRange) {
      console.log(`  Delivery timestamp: ${deliveryTimestamp}`)
      console.log(`  From timestamp: ${fromTimestamp}`)
      console.log(`  To timestamp: ${toTimestamp}`)
      console.log(`  Is after from date? ${isAfterFrom}`)
      console.log(`  Is before to date? ${isBeforeTo}`)
      console.log(
        `  ${isInRange ? "✓ IN RANGE - INCLUDED" : "✗ OUT OF RANGE - EXCLUDED"}`
      )
    }

    return isInRange
  })

  console.log(
    `\n📊 Filtered ${filtered.length} orders from ${orders.length} total\n`
  )
  return filtered
}

// Group orders by delivery date
function groupOrdersByDeliveryDate(orders: Order[]): Map<string, Order[]> {
  const grouped = new Map<string, Order[]>()

  orders.forEach((order) => {
    if (!order.deliveryDate) return

    const dateKey = order.deliveryDate
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, [])
    }
    grouped.get(dateKey)!.push(order)
  })

  // Sort by date
  const sortedEntries = Array.from(grouped.entries()).sort((a, b) => {
    const dateA = parseDeliveryDate(a[0])
    const dateB = parseDeliveryDate(b[0])
    if (!dateA || !dateB) return 0
    return dateA.getTime() - dateB.getTime()
  })

  return new Map(sortedEntries)
}

// Calculate product quantity for an order
function calculateProductQuantity(
  order: Order,
  product: Product
): number | null {
  const orderProducts = order.products.filter(
    (op) => op.productId === product.id && op.available !== false
  )

  if (orderProducts.length === 0) return null

  let totalQuantity = 0

  orderProducts.forEach((orderProduct) => {
    const title = orderProduct.product.title.toLowerCase()
    const { weight, unit, price, quantity } = orderProduct

    // Check for products with special unit configurations (like eggs)
    const unitsPerPack = getUnitsPerPack(title, price, orderProduct)
    if (unitsPerPack !== null) {
      totalQuantity += unitsPerPack * quantity
      return
    }

    // Special case: 250g Coffee
    if (weight === 250 && unit === "g" && title.includes("coffee")) {
      totalQuantity += quantity
      return
    }

    // No weight: use quantity directly
    if (!weight || weight === 0) {
      totalQuantity += quantity
      return
    }

    // Liquid units (ltr/ml): use quantity directly
    if (unit === "ltr" || unit === "ml") {
      totalQuantity += quantity
      return
    }

    // Weight-based calculation
    if (weight > 30) {
      // Convert grams to kg
      totalQuantity += quantity * (weight / 1000)
    } else {
      totalQuantity += quantity * weight
    }
  })

  return totalQuantity > 0 ? totalQuantity : null
}

// Format customer name to title case
function formatCustomerName(name: string): string {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Apply cell styling
function applyCellStyle(cell: any, fill: any, font?: any, alignment?: any) {
  if (fill) cell.fill = fill
  if (font) cell.font = font
  if (alignment) cell.alignment = alignment
}

// Style header row
function styleHeaderRow(worksheet: any, products: Product[]) {
  worksheet.getRow(1).eachCell((cell: any) => {
    cell.alignment = {
      textRotation: 90,
      vertical: "middle",
      horizontal: "center",
    }
  })

  // Highlight alternate product columns with cream color
  for (let colIndex = 3; colIndex <= products.length + 1; colIndex += 2) {
    const cell = worksheet.getCell(1, colIndex)
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: COLORS.cream,
    }
  }
}

// Style totals row
function styleTotalsRow(worksheet: any, products: Product[]) {
  const totalsRowData = worksheet.addRow([
    "Totals",
    ...products.map(() => 0),
    0,
    "Customer Name",
    "Payment Mode",
    "Action",
  ])

  totalsRowData.eachCell((cell: any) => {
    applyCellStyle(
      cell,
      {
        type: "pattern",
        pattern: "solid",
        fgColor: COLORS.black,
      },
      {
        color: { argb: COLORS.white.argb },
        bold: true,
      },
      {
        vertical: "middle",
        horizontal: "center",
      }
    )
  })

  return totalsRowData
}

// Apply alternating column colors
function applyAlternatingColors(
  worksheet: any,
  products: Product[],
  totalRows: number
) {
  for (let colIndex = 3; colIndex <= products.length + 1; colIndex += 2) {
    for (let rowIndex = 3; rowIndex <= totalRows; rowIndex++) {
      const cell = worksheet.getCell(rowIndex, colIndex)
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: COLORS.cream,
      }
    }
  }
}

// Apply gray backgrounds
function applyGrayBackgrounds(worksheet: any, products: Product[]) {
  const grayFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: COLORS.gray,
  }

  // Gray for order number column (A) from row 3 down
  worksheet.getColumn(1).eachCell((cell: any, rowNumber: number) => {
    if (rowNumber >= 3) {
      cell.fill = grayFill
    }
  })

  // Gray for action column (last column) from row 3 down
  const lastColumnIndex = products.length + 5
  for (let rowIndex = 3; rowIndex <= worksheet.rowCount; rowIndex++) {
    const lastCell = worksheet.getCell(rowIndex, lastColumnIndex)
    lastCell.fill = grayFill
  }
}

// Style payment mode cells
function stylePaymentModes(worksheet: any, products: Product[]) {
  const paymentModeColumnIndex = products.length + 4

  for (let rowIndex = 3; rowIndex <= worksheet.rowCount; rowIndex++) {
    const cell = worksheet.getCell(rowIndex, paymentModeColumnIndex)
    const paymentMode = cell.value as string

    let bgColor: any
    if (paymentMode === "CASH") {
      bgColor = COLORS.cashGreen
    } else if (paymentMode === "MOMO") {
      bgColor = COLORS.momoBlue
    } else if (paymentMode === "CARD") {
      bgColor = COLORS.cardPurple
    }

    if (bgColor) {
      applyCellStyle(
        cell,
        {
          type: "pattern",
          pattern: "solid",
          fgColor: bgColor,
        },
        undefined,
        {
          vertical: "middle",
          horizontal: "center",
        }
      )
    }
  }
}

// Apply borders to all cells
function applyBorders(worksheet: any, products: Product[]) {
  const totalRows = worksheet.rowCount
  const totalColumns = products.length + 5

  const border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  }

  for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
    for (let colIndex = 1; colIndex <= totalColumns; colIndex++) {
      worksheet.getCell(rowIndex, colIndex).border = border
    }
  }
}

// Calculate column totals
function calculateColumnTotals(worksheet: any, products: Product[]) {
  const totalRows = worksheet.rowCount

  for (let colIndex = 2; colIndex <= products.length + 1; colIndex++) {
    let total = 0
    for (let rowIndex = 3; rowIndex <= totalRows; rowIndex++) {
      const cellValue = worksheet.getCell(rowIndex, colIndex).value
      if (typeof cellValue === "number") {
        total += cellValue
      }
    }
    worksheet.getCell(2, colIndex).value = total
  }
}

// Create a worksheet for a specific delivery date
function createWorksheetForDate(
  workbook: any,
  deliveryDate: string,
  orders: Order[],
  products: Product[],
  currentDate: string
): number {
  // Create worksheet with delivery date as name (sanitize for Excel)
  const sheetName = deliveryDate.replace(/[*?:/\\[\]]/g, "-").substring(0, 31)
  const worksheet = workbook.addWorksheet(sheetName)

  // Create header row
  const headerRow = [
    currentDate,
    ...products.map((product) => product.title),
    "Total Revenue",
  ]
  worksheet.addRow(headerRow)

  // Style header and add totals row
  styleHeaderRow(worksheet, products)
  styleTotalsRow(worksheet, products)

  // Process orders and add data rows
  let totalRevenue = 0

  orders.forEach((order) => {
    const orderNumber = order.orderNumber
    const balance = order.creditAppliedTotal
      ? Math.abs(order.creditAppliedTotal)
      : 0
    const paymentAction = order.paymentAction.toUpperCase()
    const customerName = formatCustomerName(order.shippingAddress.name)

    // Calculate quantities for each product (returns null instead of "N/A")
    const orderDetails = products.map((product) =>
      calculateProductQuantity(order, product)
    )

    // Use updatedOrderTotal if available, otherwise calculate
    const totalOrderAmount =
      order.updatedOrderTotal || order.total + order.deliveryFee + balance
    totalRevenue += totalOrderAmount

    const paymentMode = order.paymentMode.toUpperCase()

    // Add data row (null values will appear as empty cells)
    worksheet.addRow([
      orderNumber,
      ...orderDetails,
      totalOrderAmount,
      customerName,
      paymentMode,
      paymentAction,
    ])
  })

  // Calculate and update totals
  calculateColumnTotals(worksheet, products)
  worksheet.getCell(2, products.length + 2).value = totalRevenue

  // Apply all styling
  applyAlternatingColors(worksheet, products, worksheet.rowCount)
  applyGrayBackgrounds(worksheet, products)
  stylePaymentModes(worksheet, products)
  applyBorders(worksheet, products)

  // Set column widths
  worksheet.columns = [
    { width: 20 }, // Order Number
    ...products.map(() => ({ width: 6 })), // Product columns
    { width: 10 }, // Total Revenue
    { width: 20 }, // Customer Name
    { width: 20 }, // Payment Mode
    { width: 20 }, // Action
  ]

  // Freeze first 2 rows
  worksheet.views = [
    {
      state: "frozen",
      xSplit: 0,
      ySplit: 2,
      topLeftCell: "A3",
      activeCell: "A3",
    },
  ]

  return totalRevenue
}

// Main export function
export default async function exportDeliveredSheet(from: Date, to: Date) {
  const currentDate = formatDate(new Date())

  // Fetch data - get ALL delivered orders, then filter by deliveryDate client-side
  const products = await fetchProducts()
  const allOrders = await fetchOrders("delivered")

  console.log(`\nReceived ${allOrders.length} delivered orders from API`)
  console.log(
    "Sample deliveryDates:",
    allOrders.slice(0, 5).map((o) => o.deliveryDate)
  )

  // Filter orders by deliveryDate and ensure status is 'delivered'
  const orders = filterOrdersByDeliveryDate(allOrders, from, to)

  // Debug logging
  console.log("=== EXPORT SUMMARY ===")
  console.log(`Total orders fetched from API: ${allOrders.length}`)
  console.log(`Filtered delivered orders in range: ${orders.length}`)
  console.log(
    `Date range: ${from.toLocaleDateString()} to ${to.toLocaleDateString()}`
  )

  if (allOrders.length > 0) {
    console.log("\nSample orders (first 3):")
    allOrders.slice(0, 3).forEach((order) => {
      console.log(
        `  - ${order.orderNumber}: status="${order.status}", deliveryDate="${order.deliveryDate}"`
      )
    })
  }

  if (orders.length === 0) {
    console.warn("❌ No delivered orders found in the specified date range")

    // Show how many orders were excluded and why
    const statusIssues = allOrders.filter(
      (o) => o.status !== "delivered"
    ).length
    const noDateIssues = allOrders.filter((o) => !o.deliveryDate).length
    const dateRangeIssues = allOrders.length - statusIssues - noDateIssues

    let message = `No delivered orders found between ${from.toLocaleDateString()} and ${to.toLocaleDateString()}.\n\n`
    message += `Total orders fetched: ${allOrders.length}\n`
    if (statusIssues > 0)
      message += `- ${statusIssues} orders with status ≠ "delivered"\n`
    if (noDateIssues > 0)
      message += `- ${noDateIssues} orders without deliveryDate\n`
    if (dateRangeIssues > 0)
      message += `- ${dateRangeIssues} orders outside date range\n`
    message += `\nCheck console for detailed filtering logs.`

    alert(message)
    return
  }

  // Group orders by delivery date
  const groupedOrders = groupOrdersByDeliveryDate(orders)
  console.log(
    `\n📊 Orders grouped into ${groupedOrders.size} delivery date(s):`
  )
  groupedOrders.forEach((ordersForDate, deliveryDate) => {
    console.log(`  - ${deliveryDate}: ${ordersForDate.length} orders`)
  })

  const workbook = new ExcelJS.Workbook()
  let grandTotalRevenue = 0

  console.log("\n📝 Creating worksheets...")
  // Create a worksheet for each delivery date
  groupedOrders.forEach((ordersForDate, deliveryDate) => {
    console.log(
      `  → Creating tab for "${deliveryDate}" with ${ordersForDate.length} orders`
    )
    const dateRevenue = createWorksheetForDate(
      workbook,
      deliveryDate,
      ordersForDate,
      products,
      currentDate
    )
    console.log(`     Revenue: ${dateRevenue.toFixed(2)}`)
    grandTotalRevenue += dateRevenue
  })

  console.log(
    `\n💰 Grand total revenue across all dates: ${grandTotalRevenue.toFixed(2)}`
  )
  console.log("=== EXPORT COMPLETE ===\n")

  // Export the workbook
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `Delivered_Orders_${currentDate.replace(/\//g, "-")}.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// // Type definitions
// interface Product {
//   id: string
//   title: string
//   [key: string]: any
// }

// interface OrderProduct {
//   productId: string
//   quantity: number
//   weight?: number
//   unit?: string
//   price: number
//   available?: boolean
//   unitsPerPack?: number // Number of units in this variant (e.g., 1 egg or 30 eggs)
//   variantName?: string // e.g., "Single", "Crate", "Dozen"
//   product: {
//     title: string
//     unitsPerPack?: number
//   }
// }

// interface Order {
//   id: string
//   orderNumber: string
//   status: string
//   deliveryDate?: string // Formatted string like "Wednesday, Jul 16th, 2025"
//   createdAt: string
//   updatedAt: string
//   creditAppliedTotal: number
//   paymentAction: string
//   paymentMode: string
//   total: number
//   subtotal: number
//   deliveryFee: number
//   updatedOrderTotal: number
//   products: OrderProduct[]
//   shippingAddress: {
//     id: string
//     name: string
//     region: string
//     city: string
//     address: string
//   }
//   dispatchRider?: {
//     id: string
//     fullName: string
//     phone: string
//   }
//   specialNotes?: string
//   [key: string]: any
// }

// // Product-specific configurations for special quantity calculations
// const PRODUCT_QUANTITY_CONFIG: Record<
//   string,
//   {
//     keyword: string
//     variants: Array<{
//       priceRange?: { min: number; max: number }
//       exactPrice?: number
//       weight?: number
//       unit?: string
//       unitsPerPack: number
//       description?: string
//     }>
//   }
// > = {
//   eggs: {
//     keyword: "eggs",
//     variants: [
//       {
//         priceRange: { min: 0, max: 10 },
//         unitsPerPack: 1,
//         description: "Single egg or small pack",
//       },
//       {
//         priceRange: { min: 90, max: 120 },
//         unitsPerPack: 30,
//         description: "Crate (30 eggs)",
//       },
//     ],
//   },
//   leafTea: {
//     keyword: "leaf tea",
//     variants: [
//       {
//         weight: 30,
//         unit: "g",
//         unitsPerPack: 1,
//         description: "30g Leaf Tea pack",
//       },
//     ],
//   },
//   // Add more products as needed
// }

// // Get units per pack based on product configuration
// function getUnitsPerPack(
//   productTitle: string,
//   price: number,
//   orderProduct: OrderProduct
// ): number | null {
//   // First, check if the order product has unitsPerPack metadata
//   if (orderProduct.unitsPerPack) {
//     return orderProduct.unitsPerPack
//   }

//   if (orderProduct.product.unitsPerPack) {
//     return orderProduct.product.unitsPerPack
//   }

//   // Fall back to configuration lookup
//   const title = productTitle.toLowerCase()
//   const { weight, unit } = orderProduct

//   for (const [productKey, config] of Object.entries(PRODUCT_QUANTITY_CONFIG)) {
//     if (title.includes(config.keyword)) {
//       // Find matching variant
//       for (const variant of config.variants) {
//         let matches = true

//         // Check price if specified
//         if (variant.exactPrice !== undefined) {
//           matches = matches && price === variant.exactPrice
//         }
//         if (variant.priceRange) {
//           matches =
//             matches &&
//             price >= variant.priceRange.min &&
//             price <= variant.priceRange.max
//         }

//         // Check weight if specified
//         if (variant.weight !== undefined) {
//           matches = matches && weight === variant.weight
//         }

//         // Check unit if specified
//         if (variant.unit !== undefined) {
//           matches = matches && unit === variant.unit
//         }

//         if (matches) {
//           return variant.unitsPerPack
//         }
//       }
//     }
//   }

//   return null
// }

// // Constants
// const COLORS = {
//   cream: { argb: "FCE5CD" },
//   black: { argb: "000000" },
//   white: { argb: "FFFFFF" },
//   gray: { argb: "D3D3D3" },
//   cashGreen: { argb: "DCE9CB" },
//   momoBlue: { argb: "DDEBFF" },
//   cardPurple: { argb: "E2E4FA" },
// } as const

// // Fetch products from the API and extract details
// async function fetchProducts(): Promise<Product[]> {
//   try {
//     const response = await fetch("/api/products")
//     if (!response.ok) {
//       throw new Error(`Failed to fetch products: ${response.statusText}`)
//     }
//     const data = await response.json()
//     return data.sort((a: Product, b: Product) => a.title.localeCompare(b.title))
//   } catch (error) {
//     console.error("Error fetching products:", error)
//     return []
//   }
// }

// // Fetch orders from the API
// async function fetchOrders(status?: string): Promise<Order[]> {
//   try {
//     const queryParams = new URLSearchParams()

//     // Only filter by status, not by date - we'll filter by deliveryDate client-side
//     if (status) queryParams.append("status", status)

//     const url = `/api/orders${queryParams.toString() ? "?" + queryParams.toString() : ""}`
//     console.log("Fetching orders from:", url)

//     const response = await fetch(url)

//     if (!response.ok) {
//       throw new Error(`Failed to fetch orders: ${response.statusText}`)
//     }

//     const data = await response.json()
//     console.log(
//       `API returned ${data.length} orders with status="${status || "any"}"`
//     )
//     return data
//   } catch (error) {
//     console.error("Error fetching orders:", error)
//     return []
//   }
// }

// // Parse formatted date string like "Wednesday, Jul 16th, 2025"
// function parseDeliveryDate(dateString: string): Date | null {
//   try {
//     // Remove day of week and ordinal suffixes (st, nd, rd, th)
//     const cleanedDate = dateString
//       .replace(/^[A-Za-z]+,\s*/, "") // Remove "Wednesday, "
//       .replace(/(\d+)(st|nd|rd|th)/, "$1") // Remove ordinal suffixes

//     // Parse the cleaned date
//     const parsedDate = new Date(cleanedDate)

//     // Check if date is valid
//     if (isNaN(parsedDate.getTime())) {
//       console.error(
//         "Invalid date after parsing:",
//         cleanedDate,
//         "from original:",
//         dateString
//       )
//       return null
//     }

//     // Normalize to start of day for consistent comparison
//     parsedDate.setHours(0, 0, 0, 0)

//     return parsedDate
//   } catch (error) {
//     console.error("Error parsing date:", dateString, error)
//     return null
//   }
// }

// // Filter orders by delivery date and status
// function filterOrdersByDeliveryDate(
//   orders: Order[],
//   from: Date,
//   to: Date
// ): Order[] {
//   // Normalize input dates to start/end of day in LOCAL timezone
//   const fromDate = new Date(from)
//   fromDate.setHours(0, 0, 0, 0)

//   const toDate = new Date(to)
//   toDate.setHours(23, 59, 59, 999)

//   console.log("\n=== DATE FILTERING DEBUG ===")
//   console.log("Input from date:", from)
//   console.log("Input to date:", to)
//   console.log(
//     "Normalized from date:",
//     fromDate.toDateString(),
//     "→",
//     fromDate.toISOString()
//   )
//   console.log(
//     "Normalized to date:",
//     toDate.toDateString(),
//     "→",
//     toDate.toISOString()
//   )
//   console.log("From timestamp:", fromDate.getTime())
//   console.log("To timestamp:", toDate.getTime())
//   console.log("===========================\n")

//   const filtered = orders.filter((order, index) => {
//     const shouldLog = index < 5 // Log first 5 orders for debugging

//     if (shouldLog)
//       console.log(
//         `\nChecking order ${index + 1}/${orders.length}: ${order.orderNumber}`
//       )

//     // Ensure order is delivered
//     if (order.status !== "delivered") {
//       if (shouldLog)
//         console.log(`  ✗ Status is "${order.status}", not "delivered"`)
//       return false
//     }
//     if (shouldLog) console.log(`  ✓ Status is "delivered"`)

//     // Ensure deliveryDate exists
//     if (!order.deliveryDate) {
//       if (shouldLog) console.log(`  ✗ No deliveryDate field`)
//       return false
//     }
//     if (shouldLog) console.log(`  ✓ Has deliveryDate: "${order.deliveryDate}"`)

//     // Parse the formatted delivery date
//     const deliveryDate = parseDeliveryDate(order.deliveryDate)

//     if (!deliveryDate) {
//       console.warn(`  ✗ Could not parse delivery date: "${order.deliveryDate}"`)
//       return false
//     }

//     // Check if delivery date is within range (inclusive)
//     const deliveryTimestamp = deliveryDate.getTime()
//     const fromTimestamp = fromDate.getTime()
//     const toTimestamp = toDate.getTime()

//     const isAfterFrom = deliveryTimestamp >= fromTimestamp
//     const isBeforeTo = deliveryTimestamp <= toTimestamp
//     const isInRange = isAfterFrom && isBeforeTo

//     if (shouldLog || !isInRange) {
//       console.log(`  Delivery timestamp: ${deliveryTimestamp}`)
//       console.log(`  From timestamp: ${fromTimestamp}`)
//       console.log(`  To timestamp: ${toTimestamp}`)
//       console.log(`  Is after from date? ${isAfterFrom}`)
//       console.log(`  Is before to date? ${isBeforeTo}`)
//       console.log(
//         `  ${isInRange ? "✓ IN RANGE - INCLUDED" : "✗ OUT OF RANGE - EXCLUDED"}`
//       )
//     }

//     return isInRange
//   })

//   console.log(
//     `\n📊 Filtered ${filtered.length} orders from ${orders.length} total\n`
//   )
//   return filtered
// }

// // Group orders by delivery date
// function groupOrdersByDeliveryDate(orders: Order[]): Map<string, Order[]> {
//   const grouped = new Map<string, Order[]>()

//   orders.forEach((order) => {
//     if (!order.deliveryDate) return

//     const dateKey = order.deliveryDate
//     if (!grouped.has(dateKey)) {
//       grouped.set(dateKey, [])
//     }
//     grouped.get(dateKey)!.push(order)
//   })

//   // Sort by date
//   const sortedEntries = Array.from(grouped.entries()).sort((a, b) => {
//     const dateA = parseDeliveryDate(a[0])
//     const dateB = parseDeliveryDate(b[0])
//     if (!dateA || !dateB) return 0
//     return dateA.getTime() - dateB.getTime()
//   })

//   return new Map(sortedEntries)
// }

// // Calculate product quantity for an order
// function calculateProductQuantity(
//   order: Order,
//   product: Product
// ): number | null {
//   const orderProducts = order.products.filter(
//     (op) => op.productId === product.id && op.available !== false
//   )

//   if (orderProducts.length === 0) return null

//   let totalQuantity = 0

//   orderProducts.forEach((orderProduct) => {
//     const title = orderProduct.product.title.toLowerCase()
//     const { weight, unit, price, quantity } = orderProduct

//     // Check for products with special unit configurations (like eggs)
//     const unitsPerPack = getUnitsPerPack(title, price, orderProduct)
//     if (unitsPerPack !== null) {
//       totalQuantity += unitsPerPack * quantity
//       return
//     }

//     // Special case: 250g Coffee
//     if (weight === 250 && unit === "g" && title.includes("coffee")) {
//       totalQuantity += quantity
//       return
//     }

//     // No weight: use quantity directly
//     if (!weight || weight === 0) {
//       totalQuantity += quantity
//       return
//     }

//     // Liquid units (ltr/ml): use quantity directly
//     if (unit === "ltr" || unit === "ml") {
//       totalQuantity += quantity
//       return
//     }

//     // Weight-based calculation
//     if (weight > 30) {
//       // Convert grams to kg
//       totalQuantity += quantity * (weight / 1000)
//     } else {
//       totalQuantity += quantity * weight
//     }
//   })

//   return totalQuantity > 0 ? totalQuantity : null
// }

// // Format customer name to title case
// function formatCustomerName(name: string): string {
//   return name
//     .toLowerCase()
//     .split(" ")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ")
// }

// // Apply cell styling
// function applyCellStyle(cell: any, fill: any, font?: any, alignment?: any) {
//   if (fill) cell.fill = fill
//   if (font) cell.font = font
//   if (alignment) cell.alignment = alignment
// }

// // Style header row
// function styleHeaderRow(worksheet: any, products: Product[]) {
//   worksheet.getRow(1).eachCell((cell: any) => {
//     cell.alignment = {
//       textRotation: 90,
//       vertical: "middle",
//       horizontal: "center",
//     }
//   })

//   // Highlight alternate product columns with cream color
//   for (let colIndex = 3; colIndex <= products.length + 1; colIndex += 2) {
//     const cell = worksheet.getCell(1, colIndex)
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: COLORS.cream,
//     }
//   }
// }

// // Style totals row
// function styleTotalsRow(worksheet: any, products: Product[]) {
//   const totalsRowData = worksheet.addRow([
//     "Totals",
//     ...products.map(() => 0),
//     0,
//     "Customer Name",
//     "Payment Mode",
//     "Action",
//   ])

//   totalsRowData.eachCell((cell: any) => {
//     applyCellStyle(
//       cell,
//       {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: COLORS.black,
//       },
//       {
//         color: { argb: COLORS.white.argb },
//         bold: true,
//       },
//       {
//         vertical: "middle",
//         horizontal: "center",
//       }
//     )
//   })

//   return totalsRowData
// }

// // Apply alternating column colors
// function applyAlternatingColors(
//   worksheet: any,
//   products: Product[],
//   totalRows: number
// ) {
//   for (let colIndex = 3; colIndex <= products.length + 1; colIndex += 2) {
//     for (let rowIndex = 3; rowIndex <= totalRows; rowIndex++) {
//       const cell = worksheet.getCell(rowIndex, colIndex)
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: COLORS.cream,
//       }
//     }
//   }
// }

// // Apply gray backgrounds
// function applyGrayBackgrounds(worksheet: any, products: Product[]) {
//   const grayFill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: COLORS.gray,
//   }

//   // Gray for order number column (A) from row 3 down
//   worksheet.getColumn(1).eachCell((cell: any, rowNumber: number) => {
//     if (rowNumber >= 3) {
//       cell.fill = grayFill
//     }
//   })

//   // Gray for action column (last column) from row 3 down
//   const lastColumnIndex = products.length + 5
//   for (let rowIndex = 3; rowIndex <= worksheet.rowCount; rowIndex++) {
//     const lastCell = worksheet.getCell(rowIndex, lastColumnIndex)
//     lastCell.fill = grayFill
//   }
// }

// // Style payment mode cells
// function stylePaymentModes(worksheet: any, products: Product[]) {
//   const paymentModeColumnIndex = products.length + 4

//   for (let rowIndex = 3; rowIndex <= worksheet.rowCount; rowIndex++) {
//     const cell = worksheet.getCell(rowIndex, paymentModeColumnIndex)
//     const paymentMode = cell.value as string

//     let bgColor: any
//     if (paymentMode === "CASH") {
//       bgColor = COLORS.cashGreen
//     } else if (paymentMode === "MOMO") {
//       bgColor = COLORS.momoBlue
//     } else if (paymentMode === "CARD") {
//       bgColor = COLORS.cardPurple
//     }

//     if (bgColor) {
//       applyCellStyle(
//         cell,
//         {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: bgColor,
//         },
//         undefined,
//         {
//           vertical: "middle",
//           horizontal: "center",
//         }
//       )
//     }
//   }
// }

// // Apply borders to all cells
// function applyBorders(worksheet: any, products: Product[]) {
//   const totalRows = worksheet.rowCount
//   const totalColumns = products.length + 5

//   const border = {
//     top: { style: "thin" },
//     left: { style: "thin" },
//     bottom: { style: "thin" },
//     right: { style: "thin" },
//   }

//   for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
//     for (let colIndex = 1; colIndex <= totalColumns; colIndex++) {
//       worksheet.getCell(rowIndex, colIndex).border = border
//     }
//   }
// }

// // Calculate column totals
// function calculateColumnTotals(worksheet: any, products: Product[]) {
//   const totalRows = worksheet.rowCount

//   for (let colIndex = 2; colIndex <= products.length + 1; colIndex++) {
//     let total = 0
//     for (let rowIndex = 3; rowIndex <= totalRows; rowIndex++) {
//       const cellValue = worksheet.getCell(rowIndex, colIndex).value
//       if (typeof cellValue === "number") {
//         total += cellValue
//       }
//     }
//     worksheet.getCell(2, colIndex).value = total
//   }
// }

// // Create a worksheet for a specific delivery date
// function createWorksheetForDate(
//   workbook: any,
//   deliveryDate: string,
//   orders: Order[],
//   products: Product[],
//   currentDate: string
// ): number {
//   // Create worksheet with delivery date as name (sanitize for Excel)
//   const sheetName = deliveryDate.replace(/[*?:/\\[\]]/g, "-").substring(0, 31)
//   const worksheet = workbook.addWorksheet(sheetName)

//   // Create header row
//   const headerRow = [
//     currentDate,
//     ...products.map((product) => product.title),
//     "Total Revenue",
//   ]
//   worksheet.addRow(headerRow)

//   // Style header and add totals row
//   styleHeaderRow(worksheet, products)
//   styleTotalsRow(worksheet, products)

//   // Process orders and add data rows
//   let totalRevenue = 0

//   orders.forEach((order) => {
//     const orderNumber = order.orderNumber
//     const balance = order.creditAppliedTotal
//       ? Math.abs(order.creditAppliedTotal)
//       : 0
//     const paymentAction = order.paymentAction.toUpperCase()
//     const customerName = formatCustomerName(order.shippingAddress.name)

//     // Calculate quantities for each product (returns null instead of "N/A")
//     const orderDetails = products.map((product) =>
//       calculateProductQuantity(order, product)
//     )

//     // Use updatedOrderTotal if available, otherwise calculate
//     const totalOrderAmount =
//       order.updatedOrderTotal || order.total + order.deliveryFee + balance
//     totalRevenue += totalOrderAmount

//     const paymentMode = order.paymentMode.toUpperCase()

//     // Add data row (null values will appear as empty cells)
//     worksheet.addRow([
//       orderNumber,
//       ...orderDetails,
//       totalOrderAmount,
//       customerName,
//       paymentMode,
//       paymentAction,
//     ])
//   })

//   // Calculate and update totals
//   calculateColumnTotals(worksheet, products)
//   worksheet.getCell(2, products.length + 2).value = totalRevenue

//   // Apply all styling
//   applyAlternatingColors(worksheet, products, worksheet.rowCount)
//   applyGrayBackgrounds(worksheet, products)
//   stylePaymentModes(worksheet, products)
//   applyBorders(worksheet, products)

//   // Set column widths
//   worksheet.columns = [
//     { width: 20 }, // Order Number
//     ...products.map(() => ({ width: 6 })), // Product columns
//     { width: 10 }, // Total Revenue
//     { width: 20 }, // Customer Name
//     { width: 20 }, // Payment Mode
//     { width: 20 }, // Action
//   ]

//   // Freeze first 2 rows
//   worksheet.views = [
//     {
//       state: "frozen",
//       xSplit: 0,
//       ySplit: 2,
//       topLeftCell: "A3",
//       activeCell: "A3",
//     },
//   ]

//   return totalRevenue
// }

// // Main export function
// export default async function exportDeliveredSheet(from: Date, to: Date) {
//   const currentDate = formatDate(new Date())

//   // Fetch data - get ALL delivered orders, then filter by deliveryDate client-side
//   const products = await fetchProducts()
//   const allOrders = await fetchOrders("delivered")

//   console.log(`\nReceived ${allOrders.length} delivered orders from API`)
//   console.log(
//     "Sample deliveryDates:",
//     allOrders.slice(0, 5).map((o) => o.deliveryDate)
//   )

//   // Filter orders by deliveryDate and ensure status is 'delivered'
//   const orders = filterOrdersByDeliveryDate(allOrders, from, to)

//   // Debug logging
//   console.log("=== EXPORT SUMMARY ===")
//   console.log(`Total orders fetched from API: ${allOrders.length}`)
//   console.log(`Filtered delivered orders in range: ${orders.length}`)
//   console.log(
//     `Date range: ${from.toLocaleDateString()} to ${to.toLocaleDateString()}`
//   )

//   if (allOrders.length > 0) {
//     console.log("\nSample orders (first 3):")
//     allOrders.slice(0, 3).forEach((order) => {
//       console.log(
//         `  - ${order.orderNumber}: status="${order.status}", deliveryDate="${order.deliveryDate}"`
//       )
//     })
//   }

//   if (orders.length === 0) {
//     console.warn("❌ No delivered orders found in the specified date range")

//     // Show how many orders were excluded and why
//     const statusIssues = allOrders.filter(
//       (o) => o.status !== "delivered"
//     ).length
//     const noDateIssues = allOrders.filter((o) => !o.deliveryDate).length
//     const dateRangeIssues = allOrders.length - statusIssues - noDateIssues

//     let message = `No delivered orders found between ${from.toLocaleDateString()} and ${to.toLocaleDateString()}.\n\n`
//     message += `Total orders fetched: ${allOrders.length}\n`
//     if (statusIssues > 0)
//       message += `- ${statusIssues} orders with status ≠ "delivered"\n`
//     if (noDateIssues > 0)
//       message += `- ${noDateIssues} orders without deliveryDate\n`
//     if (dateRangeIssues > 0)
//       message += `- ${dateRangeIssues} orders outside date range\n`
//     message += `\nCheck console for detailed filtering logs.`

//     alert(message)
//     return
//   }

//   // Group orders by delivery date
//   const groupedOrders = groupOrdersByDeliveryDate(orders)
//   console.log(
//     `\n📊 Orders grouped into ${groupedOrders.size} delivery date(s):`
//   )
//   groupedOrders.forEach((ordersForDate, deliveryDate) => {
//     console.log(`  - ${deliveryDate}: ${ordersForDate.length} orders`)
//   })

//   const workbook = new ExcelJS.Workbook()
//   let grandTotalRevenue = 0

//   console.log("\n📝 Creating worksheets...")
//   // Create a worksheet for each delivery date
//   groupedOrders.forEach((ordersForDate, deliveryDate) => {
//     console.log(
//       `  → Creating tab for "${deliveryDate}" with ${ordersForDate.length} orders`
//     )
//     const dateRevenue = createWorksheetForDate(
//       workbook,
//       deliveryDate,
//       ordersForDate,
//       products,
//       currentDate
//     )
//     console.log(`     Revenue: ${dateRevenue.toFixed(2)}`)
//     grandTotalRevenue += dateRevenue
//   })

//   console.log(
//     `\n💰 Grand total revenue across all dates: ${grandTotalRevenue.toFixed(2)}`
//   )
//   console.log("=== EXPORT COMPLETE ===\n")

//   // Export the workbook
//   const buffer = await workbook.xlsx.writeBuffer()
//   const blob = new Blob([buffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   })
//   const link = document.createElement("a")
//   link.href = URL.createObjectURL(blob)
//   link.download = `Delivered_Orders_${currentDate.replace(/\//g, "-")}.xlsx`
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
// }
