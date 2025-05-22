import twilio from "twilio"

import { NextRequest, NextResponse } from "next/server"
import { getTemplateMapFromBase64 } from "@/lib/twilio/template"
import { truncate } from "@/lib/twilio/truncate"
import { prepareOrderDetails } from "@/lib/twilio/prepareOrderDetails"

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER!
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID!

const client = twilio(accountSid, authToken)

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
  id: string
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
    const templateKey =
      rawProductCount <= 20 ? `${requiredVarCount}var` : `14var_btn`
    const contentSid = TEMPLATE_MAP[templateKey]

    const orderIdToWhahtsapp = [order?.id]

    if (!contentSid) {
      throw new Error(`No template found for ${templateKey}`)
    }

    // 3. Prepare order details with optimized product lines
    const { baseVariables, productLines, summaryValues, contactValues } =
      prepareOrderDetails(order, shipping, cappedProductCount)

    const productSection =
      rawProductCount > 20
        ? [
            `Click the *View Order Summary* button to see all purchased products.`,
          ]
        : productLines

    // 4. Build complete variables list with length validation
    const allVariables = [
      ...baseVariables.map((v) => truncate(v, 40)),
      ...productSection,
      ...summaryValues,
      ...contactValues,
      ...orderIdToWhahtsapp,
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

    console.log(allVariables, "allVariables")
    console.log(twilioVariables, "twilioVariables")

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
