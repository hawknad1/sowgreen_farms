// import twilio from "twilio"

// import { NextRequest, NextResponse } from "next/server"
// import { getTemplateMapFromBase64 } from "@/lib/twilio/template"
// import { truncate } from "@/lib/twilio/truncate"
// import { prepareOrderDetails } from "@/lib/twilio/prepareOrderDetails"
// import { Staff } from "@/types"

// const accountSid = process.env.TWILIO_ACCOUNT_SID!
// const authToken = process.env.TWILIO_AUTH_TOKEN!
// const whatsappNumber = process.env.TWILIO_WHATSAPP_SENDER!
// const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID!

// const client = twilio(accountSid, authToken)

// // Types
// interface Product {
//   quantity: number
//   quantityTotal: number
//   available: boolean
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
//   id: string
//   shippingAddress: ShippingAddress
//   orderNumber: string
//   deliveryDate: string
//   products: Product[]
//   total: number
//   deliveryFee: number
//   dispatchRider: {
//     fullName: string
//     phone: string
//   }
//   updatedOrderTotal: number
//   creditAppliedTotal: number
//   userWhatsappOptIn: {
//     customerPhone: string
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const order: Order = await req.json()
//     const shipping = order.shippingAddress

//     // 1. Fetch workers from MongoDB
//     const workers = await fetchStaff() // Add this helper function

//     // 1. Calculate product count and determine template
//     const rawProductCount = order.products.length
//     const cappedProductCount = Math.min(rawProductCount, 20)

//     // Calculate exact variable count for non-button templates
//     const baseVarCount = 7 // [name, orderNumber, date, method, address,rider, phone]
//     const summaryVarCount = 5 // [subtotal, delivery, credit, total, due]
//     const contactVarCount = 2 // [contact1, contact2]
//     const requiredVarCount =
//       baseVarCount + cappedProductCount + summaryVarCount + contactVarCount

//     // 2. Get template SID
//     const TEMPLATE_MAP = getTemplateMapFromBase64()
//     const templateKey =
//       rawProductCount > 20 ? "15var_btn" : `${requiredVarCount}var`
//     const contentSid = TEMPLATE_MAP[templateKey]

//     console.log(contentSid, "contentSid")
//     console.log(templateKey, "templateKey")

//     if (!contentSid) {
//       throw new Error(`Template ${templateKey} not found in template map`)
//     }

//     // 3. Prepare order details
//     const { baseVariables, productLines, summaryValues, contactValues } =
//       prepareOrderDetails(order, shipping, cappedProductCount, workers)

//     // 4. Build variables array according to template requirements
//     const allVariables = [
//       ...baseVariables.map((v) => truncate(v, 40)), // 7 variables
//       ...(templateKey === "15var_btn"
//         ? [
//             "Click the *View Ordered Items* button below to see all purchased products.",
//           ] // Single product line for button template
//         : productLines), // Multiple lines for other templates
//       ...summaryValues, // 5 variables
//       ...contactValues, // 2 variables
//       ...(templateKey === "15var_btn" ? [order.id] : []), // Button ID only for button template
//     ]

//     // 5. Validate variable count matches template expectations
//     const expectedVarCount =
//       templateKey === "15var_btn"
//         ? 16 // 6 + 1 + 5 + 2 + 1 (button ID)
//         : requiredVarCount

//     if (allVariables?.length !== expectedVarCount) {
//       throw new Error(
//         `Variable count mismatch! Generated ${allVariables.length} variables, ` +
//           `template ${templateKey} expects ${expectedVarCount}. ` +
//           `Variables: ${JSON.stringify(allVariables)}`
//       )
//     }

//     // 6. Create Twilio variables mapping
//     const twilioVariables = Object.fromEntries(
//       allVariables.map((value, index) => [(index + 1).toString(), value])
//     )

//     // 7. Send message with validation
//     const message = await client.messages.create({
//       from: `whatsapp:${whatsappNumber}`,
//       to: `whatsapp:${order.userWhatsappOptIn.customerPhone}`,
//       contentSid,
//       contentVariables: JSON.stringify(twilioVariables),
//     })

//     return NextResponse.json({
//       success: true,
//       messageSid: message.sid,
//       templateUsed: templateKey,
//       variableCount: allVariables.length,
//     })
//   } catch (error: any) {
//     console.error("WhatsApp API Error:", {
//       message: error.message,
//       stack: error.stack,
//       timestamp: new Date().toISOString(),
//     })

//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message,
//         ...(error.allVariables && { variables: error.allVariables }),
//         timestamp: new Date().toISOString(),
//       },
//       { status: 500 }
//     )
//   }
// }

// async function fetchStaff(): Promise<Staff[]> {
//   try {
//     // Replace with your actual MongoDB query
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/staff`,
//       { method: "GET", cache: "no-store" }
//     )
//     if (!response.ok) throw new Error("Failed to fetch staff")
//     return await response.json()
//   } catch (error) {
//     console.error("Error fetching workers:", error)
//     // Return fallback workers if fetch fails
//     return [
//       { fullName: "Xornam", phone: "0546729407" },
//       { fullName: "Samira", phone: "0504608448" },
//     ]
//   }
// }

import twilio from "twilio"

import { NextRequest, NextResponse } from "next/server"
import { getTemplateMapFromBase64 } from "@/lib/twilio/template"
import { truncate } from "@/lib/twilio/truncate"
import { prepareOrderDetails } from "@/lib/twilio/prepareOrderDetails"
import { Staff } from "@/types"

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const whatsappNumber = process.env.TWILIO_WHATSAPP_SENDER!
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID!

const client = twilio(accountSid, authToken)

// types/order.ts
export interface Product {
  quantity: number
  quantityTotal: number
  available: boolean
  weight?: number
  unit?: string
  product: {
    title: string
  }
}

export interface ShippingAddress {
  name: string
  address: string
  city: string
  region: string
  phone: string
  deliveryMethod?: string
}

export interface Order {
  id?: string
  shippingAddress: ShippingAddress
  orderNumber: string
  deliveryDate?: string // Made optional
  products?: Product[] // Made optional
  total: number
  deliveryFee?: number // Made optional
  dispatchRider?: {
    // Made optional
    fullName: string
    phone: string
  }
  updatedOrderTotal?: number // Made optional
  creditAppliedTotal?: number // Made optional
  userWhatsappOptIn?: {
    // Made optional
    customerPhone: string
  }
  paymentMethod?: string
  createdAt?: string | Date
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const order: Order = JSON.parse(rawBody)

    // Validate required fields
    if (!order?.orderNumber || !order?.shippingAddress) {
      throw new Error("Missing required order fields")
    }

    const shipping = order.shippingAddress
    const products = order.products || []
    const customerPhone = order.userWhatsappOptIn?.customerPhone

    if (!customerPhone) {
      throw new Error("Customer WhatsApp phone number is missing")
    }

    const workers = await fetchStaff()

    // 1. Calculate product count and determine template
    const rawProductCount = order.products.length
    const cappedProductCount = Math.min(rawProductCount, 20)

    // Calculate exact variable count for non-button templates
    const baseVarCount = 7 // [name, orderNumber, date, method, address,rider, phone]
    const summaryVarCount = 5 // [subtotal, delivery, credit, total, due]
    const contactVarCount = 2 // [contact1, contact2]
    const requiredVarCount =
      baseVarCount + cappedProductCount + summaryVarCount + contactVarCount

    // 2. Get template SID
    const TEMPLATE_MAP = getTemplateMapFromBase64()
    const templateKey =
      rawProductCount > 20 ? "15var_btn" : `${requiredVarCount}var`
    const contentSid = TEMPLATE_MAP[templateKey]

    console.log(contentSid, "contentSid")
    console.log(templateKey, "templateKey")

    if (!contentSid) {
      throw new Error(`Template ${templateKey} not found in template map`)
    }

    // 3. Prepare order details
    const { baseVariables, productLines, summaryValues, contactValues } =
      prepareOrderDetails(order, shipping, cappedProductCount, workers)

    // 4. Build variables array according to template requirements
    const allVariables = [
      ...baseVariables.map((v) => truncate(v, 40)), // 7 variables
      ...(templateKey === "15var_btn"
        ? [
            "Click the *View Ordered Items* button below to see all purchased products.",
          ] // Single product line for button template
        : productLines), // Multiple lines for other templates
      ...summaryValues, // 5 variables
      ...contactValues, // 2 variables
      ...(templateKey === "15var_btn" ? [order.id] : []), // Button ID only for button template
    ]

    // 5. Validate variable count matches template expectations
    const expectedVarCount =
      templateKey === "15var_btn"
        ? 16 // 6 + 1 + 5 + 2 + 1 (button ID)
        : requiredVarCount

    if (allVariables?.length !== expectedVarCount) {
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

async function fetchStaff(): Promise<Staff[]> {
  try {
    // Replace with your actual MongoDB query
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/staff`,
      { method: "GET", cache: "no-store" }
    )
    if (!response.ok) throw new Error("Failed to fetch staff")
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
