import twilio from "twilio"

import { NextRequest, NextResponse } from "next/server"
import { getTemplateMapFromBase64 } from "@/lib/twilio/template"
import { truncate } from "@/lib/twilio/truncate"
import { prepareOrderDetails } from "@/lib/twilio/prepareOrderDetails"
import { Staff } from "@/types"

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
//     // const templateKey =
//     //   rawProductCount <= 20 ? `${requiredVarCount}var` : `14var_btn`
//     const templateKey =
//       rawProductCount > 20
//         ? "14var_btn"
//         : `${Math.min(13 + rawProductCount, 33)}var`
//     const contentSid = TEMPLATE_MAP[templateKey]
//     if (!contentSid) throw new Error(`Template ${templateKey} not found`)

//     const orderIdToWhahtsapp = [order?.id]

//     if (!contentSid) {
//       throw new Error(`No template found for ${templateKey}`)
//     }

//     // 3. Prepare order details with optimized product lines
//     const { baseVariables, productLines, summaryValues, contactValues } =
//       prepareOrderDetails(order, shipping, cappedProductCount)

//     const productSection =
//       rawProductCount > 20
//         ? [
//             `Click the *View Order Summary* button below to see all purchased products.`,
//           ]
//         : productLines

//     // 4. Build complete variables list with length validation
//     const allVariables = [
//       ...baseVariables.map((v: any) => truncate(v, 40)),
//       ...productSection,
//       ...summaryValues,
//       ...contactValues,
//       // ...orderIdToWhahtsapp,
//       order?.id,
//     ]

//     // // 5. Validate total message length
//     // const fullMessage = allVariables.join(" ")
//     // if (fullMessage.length > 1500) {
//     //   throw new Error(
//     //     `Message length (${fullMessage.length}) exceeds safe limit`
//     //   )
//     // }

//     // 5. Validate variable count matches template
//     const expectedVarCount =
//       templateKey === "14var_btn"
//         ? 15
//         : parseInt(templateKey.replace("var", ""))
//     if (allVariables.length !== expectedVarCount) {
//       throw new Error(
//         `Variable count mismatch (${allVariables.length} vs ${expectedVarCount})`
//       )
//     }

//     console.log(expectedVarCount, "expectedVarCount")
//     console.log(templateKey, "templateKey")

//     // 6. Create Twilio variables mapping
//     const twilioVariables = Object.fromEntries(
//       allVariables.map((value, index) => [(index + 1).toString(), value])
//     )

//     // 7. Send message
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

export async function POST(req: NextRequest) {
  try {
    const order: Order = await req.json()
    const shipping = order.shippingAddress

    // 1. Fetch workers from MongoDB
    const workers = await fetchWorkers() // Add this helper function

    // 1. Calculate product count and determine template
    const rawProductCount = order.products.length
    const cappedProductCount = Math.min(rawProductCount, 20)

    // Calculate exact variable count for non-button templates
    const baseVarCount = 6 // [name, orderNumber, date, method, address, phone]
    const summaryVarCount = 5 // [subtotal, delivery, credit, total, due]
    const contactVarCount = 2 // [contact1, contact2]
    const requiredVarCount =
      baseVarCount + cappedProductCount + summaryVarCount + contactVarCount

    // 2. Get template SID
    const TEMPLATE_MAP = getTemplateMapFromBase64()
    const templateKey =
      rawProductCount > 20 ? "14var_btn" : `${requiredVarCount}var`
    const contentSid = TEMPLATE_MAP[templateKey]

    if (!contentSid) {
      throw new Error(`Template ${templateKey} not found in template map`)
    }

    // 3. Prepare order details
    const { baseVariables, productLines, summaryValues, contactValues } =
      prepareOrderDetails(order, shipping, cappedProductCount, workers)

    // 4. Build variables array according to template requirements
    const allVariables = [
      ...baseVariables.map((v) => truncate(v, 40)), // 6 variables
      ...(templateKey === "14var_btn"
        ? [
            "Click the *View Order Summary* button below to see all purchased products.",
          ] // Single product line for button template
        : productLines), // Multiple lines for other templates
      ...summaryValues, // 5 variables
      ...contactValues, // 2 variables
      ...(templateKey === "14var_btn" ? [order.id] : []), // Button ID only for button template
    ]

    // 5. Validate variable count matches template expectations
    const expectedVarCount =
      templateKey === "14var_btn"
        ? 15 // 6 + 1 + 5 + 2 + 1 (button ID)
        : requiredVarCount

    if (allVariables.length !== expectedVarCount) {
      throw new Error(
        `Variable count mismatch! Generated ${allVariables.length} variables, ` +
          `template ${templateKey} expects ${expectedVarCount}. ` +
          `Variables: ${JSON.stringify(allVariables)}`
      )
    }

    // 6. Create Twilio variables mapping
    const twilioVariables = Object.fromEntries(
      allVariables.map((value, index) => [(index + 1).toString(), value])
    )

    // 7. Send message with validation
    const message = await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${order.userWhatsappOptIn.customerPhone}`,
      contentSid,
      contentVariables: JSON.stringify(twilioVariables),
    })

    // Debug logs
    console.log("Message SID:", message.sid)
    console.log("Template used:", templateKey)
    console.log("Variables sent:", twilioVariables)

    return NextResponse.json({
      success: true,
      messageSid: message.sid,
      templateUsed: templateKey,
      variableCount: allVariables.length,
    })
  } catch (error: any) {
    console.error("WhatsApp API Error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        ...(error.allVariables && { variables: error.allVariables }),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

async function fetchWorkers(): Promise<Staff[]> {
  try {
    // Replace with your actual MongoDB query
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/staff`
    )
    if (!response.ok) throw new Error("Failed to fetch workers")
    return await response.json()
  } catch (error) {
    console.error("Error fetching workers:", error)
    // Return fallback workers if fetch fails
    return [
      { fullName: "Xornam", phone: "0546729407" },
      { fullName: "Samira", phone: "0504608448" },
    ]
  }
}
