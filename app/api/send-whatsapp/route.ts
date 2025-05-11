// app/api/send-whatsapp/route.js

import { formatCurrency } from "@/lib/utils"
import { NextResponse } from "next/server"
import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER! // Twilio WhatsApp Sender Number
const contentSid = process.env.TWILIO_CONTENT_SID!
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID!

const client = twilio(accountSid, authToken)

// export async function POST(request: Request) {
//   try {
//     const { order } = await request.json()
//     console.log(order, "here at endpoint...")

//     const customerPhone = order?.shippingAddress?.phone

//     // if (!order || !customerPhone) {
//     //   return NextResponse.json(
//     //     { error: "Missing required fields: order and customerPhone" },
//     //     { status: 400 }
//     //   )
//     // }

//     if (!order) {
//       return NextResponse.json(
//         { error: "Missing required fields: order and customerPhone" },
//         { status: 400 }
//       )
//     }

//     const address = `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.region}`

//     const to = `whatsapp:${
//       customerPhone.startsWith("+")
//         ? customerPhone
//         : `+233${customerPhone.replace(/^0/, "")}`
//     }`

//     // const orderSummary = order.products
//     //   .map((item: any) => {
//     //     const weight = item.weight ? `${item.weight}${item.unit}` : ""
//     //     return `${item.quantity} x ${item.product.title} ${weight}`.trim()
//     //   })
//     //   .join("\n")

//     const orderSummary = order.products
//       .map((item: any) => {
//         const weight = item.weight ? `${item.weight}${item.unit}` : ""
//         return `${item.quantity} x ${item.product.title} ${weight}`.trim()
//       })
//       .join(", ") // No line breaks, more stable

//     const contentVariables = {
//       "1": order?.shippingAddress.name,
//       "2": order?.orderNumber,
//       "3": order?.deliveryDate,
//       "4": order?.shippingAddress.deliveryMethod,
//       "5": address,
//       "6": order?.shippingAddress.phone,
//       "7": orderSummary,
//       "8": order?.deliveryFee,
//       "9": order?.total,
//       "10": process.env.SUPPORT_EMAIL || "support@sowgreen.com",
//     }

//     const variables = {
//       "1": "Test User",
//       "2": "SG123456",
//       "3": "May 14",
//       "4": "Home Delivery",
//       "5": "123 Some Street, City, Region",
//       "6": "0540000000",
//       "7": "- 1 x Pineapple",
//       "8": "30",
//       "9": "150",
//       "10": "support@sowgreen.com",
//     }

//     const message = await client.messages.create({
//       from: "whatsapp:+15557258086",
//       to: "whatsapp:+233548332803",
//       contentSid: "HX89473c1feec5985aee30a08a57f165c1", // your approved template SID
//       contentVariables: JSON.stringify(contentVariables), // ✅ THIS is the key line
//     })

//     console.log(contentVariables, "contentVariables")
//     console.log(variables, "variables")

//     return NextResponse.json({ success: true, messageId: message.sid })
//   } catch (error) {
//     console.error("Error sending WhatsApp message:", error)
//     return NextResponse.json(
//       { error: "Failed to send WhatsApp message" },
//       { status: 500 }
//     )
//   }
// }

export async function POST(req: Request) {
  const order = await req.json()

  const shipping = order.shippingAddress
  const customerName = shipping.name
  const orderNumber = order.orderNumber
  const deliveryDate = order.deliveryDate
  const deliveryMethod = shipping.deliveryMethod || "Pickup"
  const address = `${shipping.address}, ${shipping.city}, ${shipping.region}`
  const phone = shipping.phone

  // Create order summary with bullet points using template literals
  const orderSummary = order.products
    .map((item: any) => {
      const weight = item.weight ? `${item.weight}${item.unit}` : ""
      return `• ${item.quantity} x ${
        item.product.title
      } ${weight} - ${formatCurrency(item?.quantityTotal, "GHS")}`.trim()
    })
    .join(",") // Use comma as separator but keep bullet points

  const deliveryFee = formatCurrency(
    order.deliveryFee?.toString() ?? "0",
    "GHS"
  )

  const totalAmount = order?.total + order?.deliveryFee
  const total = formatCurrency(totalAmount?.toString() ?? "0", "GHS")

  const creditBalance = formatCurrency(
    order?.creditAppliedTotal?.toString(),
    "GHS"
  )
  const subtotal = formatCurrency(order?.total?.toString(), "GHS")
  const supportEmail = "support@sowgreen.com"

  const variables = {
    "1": customerName,
    "2": orderNumber,
    "3": deliveryDate,
    "4": deliveryMethod,
    "5": address,
    "6": phone,
    "7": orderSummary, // This now has bullet points but no line breaks
    "8": creditBalance,
    "9": subtotal,
    "10": deliveryFee,
    "11": total,
    "12": supportEmail,
  }

  console.log(orderSummary, "orderSummary")
  console.log(variables, "variables")

  try {
    const message = await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${order.userWhatsappOptIn.customerPhone}`,
      contentSid,
      //   contentVariables: JSON.stringify({
      //     "1": customerName,
      //     "2": orderNumber,
      //     "3": deliveryDate,
      //     "4": deliveryMethod,
      //     "5": address,
      //     "6": phone,
      //     "7": orderSummary, // This now has bullet points but no line breaks
      //     "8": creditBalance,
      //     "9": subtotal,
      //     "10": deliveryFee,
      //     "11": total,
      //     "12": supportEmail,
      //   }),
      contentVariables: JSON.stringify(variables),
    })

    return NextResponse.json({ success: true, messageSid: message.sid })
  } catch (error: any) {
    console.error("Twilio Error:", error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// export async function POST(req: Request) {
//   const order = await req.json()

//   const shipping = order.shippingAddress
//   const customerName = shipping.name
//   const orderNumber = order.orderNumber
//   const deliveryDate = order.deliveryDate
//   const deliveryMethod = shipping.deliveryMethod || "Pickup"
//   const address = `${shipping.address}, ${shipping.city}, ${shipping.region}`
//   const phone = shipping.phone

//   const orderSummary = order.products
//     .map((item: any) => {
//       const weight = item.weight ? `${item.weight}${item.unit}` : ""
//       return `${item.quantity} x ${item.product.title} ${weight}`.trim()
//     })
//     .join(",") // No line breaks, more stable

//   const deliveryFee = formatCurrency(
//     order.deliveryFee?.toString() ?? "0",
//     "GHS"
//   )

//   const totalAmount = order?.total + order?.deliveryFee
//   const total = formatCurrency(totalAmount?.toString() ?? "0", "GHS")

//   const creditBalance = formatCurrency(
//     order?.creditAppliedTotal?.toString(),
//     "GHS"
//   )
//   const subtotal = formatCurrency(order?.total?.toString(), "GHS")
//   const supportEmail = "support@sowgreen.com"

//   try {
//     const message = await client.messages.create({
//       from: "whatsapp:+15557258086",
//       to: `whatsapp:${order.userWhatsappOptIn.customerPhone}`,
//       contentSid, // e.g., 'HXxxxx'
//       contentVariables: JSON.stringify({
//         "1": customerName,
//         "2": orderNumber,
//         "3": deliveryDate,
//         "4": deliveryMethod,
//         "5": address,
//         "6": phone,
//         "7": orderSummary, // properly escaped
//         "8": creditBalance,
//         "9": subtotal,
//         "10": deliveryFee,
//         "11": total,
//         "12": supportEmail,
//       }),
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
