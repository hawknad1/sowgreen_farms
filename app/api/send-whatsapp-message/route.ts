// import { NextRequest, NextResponse } from "next/server"
// import { formatCurrency } from "@/lib/utils"
// import twilio from "twilio"

// const accountSid = process.env.TWILIO_ACCOUNT_SID!
// const authToken = process.env.TWILIO_AUTH_TOKEN!
// const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER! // Twilio WhatsApp Sender Number
// const contentSid = process.env.TWILIO_CONTENT_SID!
// const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID!

// const client = twilio(accountSid, authToken)

// // Example worker contacts — adjust as needed
// const sowgreenWorkers = [
//   { name: "Support Team", phone: "+233551234567" },
//   { name: "Logistics Team", phone: "+233557654321" },
// ]

// // Define types for order structure
// interface Product {
//   quantity: number
//   quantityTotal: number
//   weight?: number
//   unit?: string
//   product: {
//     title: string
//   }
// }

// interface ShippingAddress {
//   name: string
//   address: string
//   city: string
//   region: string
//   phone: string
//   deliveryMethod?: string
// }

// interface Order {
//   shippingAddress: ShippingAddress
//   orderNumber: string
//   deliveryDate: string
//   products: Product[]
//   total: number
//   deliveryFee: number
//   updatedOrderTotal: number
//   creditAppliedTotal: number
//   userWhatsappOptIn: {
//     customerPhone: string
//   }
// }

// // Parse TEMPLATE_MAP from env
// const TEMPLATE_MAP = (() => {
//   const jsonStr = process.env.TWILIO_TEMPLATE_MAP_JSON
//   console.log("Raw env value:", jsonStr)

//   try {
//     return jsonStr ? JSON.parse(jsonStr) : {}
//   } catch (e) {
//     console.error("Failed to parse TWILIO_TEMPLATE_MAP_JSON", e)
//     return {}
//   }
// })()

// // Map item count to expected number of summary lines (for validation)
// const TEMPLATE_VARIABLE_COUNT = {
//   1: 1,
//   2: 2,
//   3: 3,
//   4: 4,
//   5: 5,
//   6: 6,
//   7: 7,
//   8: 8,
//   9: 9,
//   10: 10,
//   11: 11,
//   12: 12,
//   13: 13,
//   14: 14,
//   15: 15,
//   16: 16,
//   17: 17,
//   18: 18,
//   19: 19,
//   20: 20,
// } as const

// export type TemplateCount = keyof typeof TEMPLATE_VARIABLE_COUNT

// // Main route handler
// export async function POST(req: NextRequest) {
//   try {
//     const order: Order = await req.json()

//     const shipping = order.shippingAddress
//     const customerName = shipping.name
//     const orderNumber = order.orderNumber
//     const deliveryDate = order.deliveryDate
//     const deliveryMethod = shipping.deliveryMethod || "Pickup"
//     const address = `${shipping.address}, ${shipping.city}, ${shipping.region}`
//     const phone = shipping.phone
//     const totalDue = formatCurrency(order?.updatedOrderTotal, "GHS")
//     const totalAmount = formatCurrency(order?.total + order?.deliveryFee, "GHS")
//     const creditBalance = formatCurrency(order?.creditAppliedTotal, "GHS")
//     const subtotal = formatCurrency(order?.total, "GHS")
//     const supportEmail = "support@sowgreen.com"
//     const worker_one = `${sowgreenWorkers[0].name}: ${sowgreenWorkers[0].phone}`
//     const worker_two = `${sowgreenWorkers[1].name}: ${sowgreenWorkers[1].phone}`

//     // Determine which template to use
//     const itemCount = order.products.length
//     const templateCount = Math.min(itemCount, 20) as TemplateCount

//     const contentSid = TEMPLATE_MAP[templateCount] || TEMPLATE_MAP["20"]

//     console.log(contentSid, "contentSid")
//     console.log(TEMPLATE_MAP, "TEMPLATE_MAP")
//     console.log(
//       "TWILIO_TEMPLATE_MAP_JSON exists?",
//       !!process.env.TWILIO_TEMPLATE_MAP_JSON
//     )

//     if (!contentSid) {
//       throw new Error(`No template found for item count: ${templateCount}`)
//     }

//     const orderSummaryLines = TEMPLATE_VARIABLE_COUNT[templateCount] || 0

//     // Format product list into bullet points
//     const productLines = order.products
//       .slice(0, orderSummaryLines)
//       .map((item) => {
//         const weight = item.weight ? `${item.weight}${item.unit}` : ""
//         return `• ${item.quantity} x ${
//           item.product.title
//         } ${weight} - ${formatCurrency(item.quantityTotal, "GHS")}`
//       })

//     // Fill remaining slots with empty strings
//     while (productLines.length < orderSummaryLines) {
//       productLines.push("")
//     }

//     // Build base variables
//     const baseVariables = {
//       "1": customerName,
//       "2": orderNumber,
//       "3": deliveryDate,
//       "4": deliveryMethod,
//       "5": address,
//       "6": phone,
//       "8": subtotal,
//       "9": formatCurrency(order.deliveryFee ?? 0, "GHS"),
//       "10": creditBalance,
//       "11": totalAmount,
//       "12": totalDue,
//       "13": supportEmail,
//       "14": worker_one,
//       "15": worker_two,
//     }

//     // Add product lines starting at position 7
//     const productVariables = Object.fromEntries(
//       productLines.map((line, i) => [String(i + 7), line])
//     )

//     const contentVariables = JSON.stringify({
//       ...baseVariables,
//       ...productVariables,
//     })

//     if (!whatsappNumber) {
//       throw new Error("TWILIO_WHATSAPP_NUMBER is not set")
//     }

//     // Send message via Twilio
//     const message = await client.messages.create({
//       from: `whatsapp:${whatsappNumber}`,
//       to: `whatsapp:${order.userWhatsappOptIn.customerPhone}`,
//       contentSid,
//       contentVariables,
//     })

//     return NextResponse.json({ success: true, messageSid: message.sid })
//   } catch (error: any) {
//     console.error("Twilio Error:", error.message)
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     )
//   }
// }

import { NextRequest, NextResponse } from "next/server"
import { formatCurrency } from "@/lib/utils"
import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER!
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID!
const DEBUG = process.env.NODE_ENV !== "production"

const client = twilio(accountSid, authToken)

const sowgreenWorkers = [
  { name: "Xornam", phone: "0546729407" },
  { name: "Samira", phone: "0504608448" },
]

const worker_one = `${sowgreenWorkers[0].name}: ${sowgreenWorkers[0].phone}`
const worker_two = `${sowgreenWorkers[1].name}: ${sowgreenWorkers[1].phone}`

// Types
interface Product {
  quantity: number
  quantityTotal: number
  weight?: number
  unit?: string
  product: {
    title: string
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
  updatedOrderTotal: number
  creditAppliedTotal: number
  userWhatsappOptIn: {
    customerPhone: string
  }
}

interface TemplateMap {
  [key: string]: string
}

interface OrderDetails {
  baseVariables: string[]
  productLines: string[]
  summaryValues: string[]
  contactValues: string[]
}

function getTemplateMapFromBase64(): Record<string, string> {
  const encoded = process.env.TWILIO_TEMPLATE_MAP_BASE64
  if (!encoded) {
    console.error("TWILIO_TEMPLATE_MAP_BASE64 is not set.")
    return {}
  }

  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf-8")
    return JSON.parse(decoded)
  } catch (err) {
    console.error("Failed to decode or parse TWILIO_TEMPLATE_MAP_BASE64:", err)
    return {}
  }
}

export async function POST(req: NextRequest) {
  try {
    const order: Order = await req.json()
    const shipping = order.shippingAddress

    // 1. Calculate product count with max 20 limit
    const rawProductCount = order.products.length
    const cappedProductCount = Math.min(rawProductCount, 20)
    const requiredVarCount = 13 + cappedProductCount

    // 2. Get template SID
    const TEMPLATE_MAP = getTemplateMapFromBase64()
    const templateKey = `${requiredVarCount}var`
    const contentSid = TEMPLATE_MAP[templateKey]

    if (!contentSid) {
      throw new Error(`No template found for ${templateKey}`)
    }

    // 3. Prepare order details with optimized product lines
    const { baseVariables, productLines, summaryValues, contactValues } =
      prepareOrderDetails(order, shipping, cappedProductCount)

    // 4. Build complete variables list with length validation
    const allVariables = [
      ...baseVariables.map((v) => truncate(v, 40)),
      ...productLines,
      ...summaryValues,
      ...contactValues,
    ]

    // 5. Validate total message length
    const fullMessage = allVariables.join(" ")
    if (fullMessage.length > 1500) {
      throw new Error(
        `Message length (${fullMessage.length}) exceeds safe limit`
      )
    }

    // 6. Create Twilio variables mapping
    const twilioVariables = Object.fromEntries(
      allVariables.map((value, index) => [(index + 1).toString(), value])
    )

    // 7. Send message
    const message = await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${order.userWhatsappOptIn.customerPhone}`,
      contentSid,
      contentVariables: JSON.stringify(twilioVariables),
    })

    return NextResponse.json({ success: true, messageSid: message.sid })
  } catch (error: any) {
    console.error("Twilio Error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

function prepareOrderDetails(
  order: Order,
  shipping: ShippingAddress,
  maxProducts: number
) {
  // 1. Base information with minimal truncation
  const baseVariables = [
    truncate(shipping.name, 24),
    order.orderNumber,
    truncate(order.deliveryDate, 20),
    truncate(shipping.deliveryMethod || "Pickup", 14),
    truncate(`${shipping.address}, ${shipping.city}`, 48),
    shipping.phone,
  ]

  // 2. Product handling with optimized combined line
  const allProducts = order.products
  let productLines: string[] = []

  if (allProducts.length > maxProducts) {
    const firstProducts = allProducts.slice(0, 19)
    const remainingProducts = allProducts.slice(19)

    productLines = [
      ...firstProducts.map((p) => formatProductLine(p, 28)), // Increased title length
      remainingProducts
        .map(
          (p) =>
            `• ${p.quantity}x ${truncate(p.product.title, 13)} ` +
            `${p.weight ? p.weight + p.unit : ""} - ${formatCurrency(
              p.quantityTotal,
              "GHS"
            )}`
        )
        .join(", "), // Keep comma+space separator
      // .substring(0, 85), // Increased line length limit
    ]
  } else {
    productLines = [
      ...allProducts.map((p) => formatProductLine(p, 24)),
      ...Array(maxProducts - allProducts.length).fill(""),
    ]
  }

  // 3. Compact summary values
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

// Product formatter with dynamic truncation
const formatProductLine = (p: Product, titleLength: number): string => {
  const title = truncate(p.product.title, titleLength)
  const weight = p.weight ? ` ${p.weight}${p.unit}` : ""
  return `✅ ${p.quantity}x ${title}${weight} - ${formatCurrency(
    p.quantityTotal,
    "GHS"
  )}`
}

// Smart truncation helper
const truncate = (str: string, max: number): string =>
  str.length > max ? str.slice(0, max - 1) + "..." : str

// const formatProductLine = (p: Product): string => {
//   const title = truncate(p.product.title, 18)
//   const weight = p.weight ? ` ${p.weight}${p.unit}` : ""
//   return `• ${p.quantity}x ${title}${weight} - ${formatCurrency(
//     p.quantityTotal,
//     "GHS"
//   )}`
// }

// export async function POST(req: NextRequest) {
//   try {
//     const order: Order = await req.json()
//     const shipping = order.shippingAddress

//     // 1. Calculate product count with max 20 limit
//     const rawProductCount = order.products.length
//     const cappedProductCount = Math.min(rawProductCount, 20)
//     const requiredVarCount = 13 + cappedProductCount

//     // 2. Get template SID
//     const TEMPLATE_MAP = getTemplateMapFromBase64()
//     const templateKey = `${requiredVarCount}var`
//     const contentSid = TEMPLATE_MAP[templateKey]

//     if (!contentSid) {
//       throw new Error(`No template found for ${templateKey}`)
//     }

//     // 3. Prepare order details with capped products
//     const { baseVariables, productLines, summaryValues, contactValues } =
//       prepareOrderDetails(order, shipping, cappedProductCount)

//     // 4. Build complete variables list
//     const allVariables = [
//       ...baseVariables,
//       ...productLines,
//       ...summaryValues,
//       ...contactValues,
//     ]

//     // 5. Create Twilio variables mapping
//     const twilioVariables = Object.fromEntries(
//       allVariables.map((value, index) => [(index + 1).toString(), value])
//     )

//     // 6. Send message
//     const message = await client.messages.create({
//       from: `whatsapp:${whatsappNumber}`,
//       to: `whatsapp:${order.userWhatsappOptIn.customerPhone}`,
//       contentSid,
//       contentVariables: JSON.stringify(twilioVariables),
//     })

//     return NextResponse.json({ success: true, messageSid: message.sid })
//   } catch (error: any) {
//     console.error("Twilio Error:", error)
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     )
//   }
// }

// function prepareOrderDetails(
//   order: Order,
//   shipping: ShippingAddress,
//   maxProducts: number
// ): OrderDetails {
//   // Base information (6 variables)
//   const baseVariables = [
//     shipping.name,
//     order.orderNumber,
//     order.deliveryDate,
//     shipping.deliveryMethod || "Pickup",
//     `${shipping.address}, ${shipping.city}, ${shipping.region}`,
//     shipping.phone,
//   ]

//   // Product lines (capped at maxProducts)
//   const productLines = order.products.slice(0, maxProducts).map((p) => {
//     const weightStr = p.weight ? ` ${p.weight}${p.unit}` : ""
//     return `✅ ${p.quantity} x ${
//       p.product.title
//     }${weightStr} - ${formatCurrency(p.quantityTotal, "GHS")}`
//   })

//   // Summary values (5 variables)
//   const summaryValues = [
//     formatCurrency(order.total, "GHS"),
//     formatCurrency(order.deliveryFee ?? 0, "GHS"),
//     formatCurrency(order.creditAppliedTotal, "GHS"),
//     formatCurrency(order.total + (order.deliveryFee ?? 0), "GHS"),
//     formatCurrency(order.updatedOrderTotal, "GHS"),
//   ]

//   // Contact information (2 variables)
//   const contactValues = [
//     `${sowgreenWorkers[0].name}: ${sowgreenWorkers[0].phone}`,
//     `${sowgreenWorkers[1].name}: ${sowgreenWorkers[1].phone}`,
//   ]

//   return { baseVariables, productLines, summaryValues, contactValues }
// }
