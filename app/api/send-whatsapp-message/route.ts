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
  available: boolean
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
  const deliveryMethod = (shipping.deliveryMethod || "Pickup").trim()

  const displayMethod =
    deliveryMethod !== "Home Delivery"
      ? `Pickup @ ${deliveryMethod}`
      : deliveryMethod

  // 1. Base information with minimal truncation
  const baseVariables = [
    shipping.name?.split(" ")[0],
    order.orderNumber,
    // truncate(order.deliveryDate, 20),
    order.deliveryDate?.split(",").slice(0, 2).join(","),
    displayMethod,
    `${shipping.address}, ${shipping.city}`,
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
  if (p.available === false) {
    return `❌ ${title}: *N/A*` // Show product as unavailable
  }
  const weight = p.weight ? ` ${p.weight}${p.unit}` : ""
  return `✅ ${p.quantity}x ${title}${weight} - ${formatCurrency(
    p.quantityTotal,
    "GHS"
  )}`
}

// Smart truncation helper
const truncate = (str: string, max: number): string =>
  str.length > max ? str.slice(0, max - 1) + "..." : str
