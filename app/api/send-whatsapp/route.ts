// app/api/send-whatsapp/route.js

import { sowgreenWorkers } from "@/constants"
import { formatCurrency } from "@/lib/utils"
import { NextResponse } from "next/server"
import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER! // Twilio WhatsApp Sender Number
const contentSid = process.env.TWILIO_CONTENT_SID!
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID!

const client = twilio(accountSid, authToken)

// export async function POST(req: Request) {
//   const order: Order = await req.json()

//   const shipping = order.shippingAddress
//   const customerName = shipping.name
//   const orderNumber = order.orderNumber
//   const deliveryDate = order.deliveryDate
//   const deliveryMethod = shipping.deliveryMethod || "Pickup"
//   const address = `${shipping.address}, ${shipping.city}, ${shipping.region}`
//   const phone = shipping.phone
//   const totalDue = formatCurrency(order?.updatedOrderTotal, "GHS")
//   const total_amount = order?.total + order?.deliveryFee
//   const credit_balance = order?.creditAppliedTotal

//   // Create order summary with bullet points using template literals
//   //   const orderSummary = order.products
//   //     .map((item: any) => {
//   //       const weight = item.weight ? `${item.weight}${item.unit}` : ""
//   //       return `• ${item.quantity} x ${
//   //         item.product.title
//   //       } ${weight} - ${formatCurrency(item?.quantityTotal, "GHS")}`.trim()
//   //     })
//   //     .join(",") // Use comma as separator but keep bullet points

//   const orderSummary = order.products.map((item: any) => {
//     const weight = item.weight ? `${item.weight}${item.unit}` : ""
//     const productList = `• ${item.quantity} x ${
//       item.product.title
//     } ${weight} - ${formatCurrency(item?.quantityTotal, "GHS")}\n`.trim()
//     return productList
//   })

//   //   const orderSummary = order.products.map((item: any) => {
//   //     const weight = item.weight ? `${item.weight}${item.unit}` : ""
//   //     const productList = `• ${item.quantity} x ${
//   //       item.product.title
//   //     } ${weight} - ${formatCurrency(item?.quantityTotal, "GHS")}`.trim()
//   //     return productList
//   //   })

//   const itemsList = order.products
//     .map((item: any) => {
//       if (!item?.product) {
//         return "- Product details missing"
//       }

//       if (item?.available === false) {
//         return `• ${item?.product.title}: *N/A*`
//       }

//       const productWeight = item?.weight
//         ? `${item?.weight < 1 ? item?.weight * 1000 : item?.weight}${
//             item?.unit || ""
//           }`
//         : "N/A"

//       return `• ${item.quantity} x ${
//         item.product.title
//       } ${productWeight} - ${formatCurrency(item?.quantityTotal, "GHS")}`.trim()
//     })
//     .slice(0, 15) // Only take the first 5 items

//   // Fill up to 5 lines in case there are fewer than 5 products
//   while (itemsList.length < 15) {
//     itemsList.push("") // or push(" ") or some default like "-")
//   }

//   //   const itemsList = order.products.map((item: any) => {
//   //     if (!item?.product) {
//   //       return "- Product details missing" // Handle missing product details
//   //     }

//   //     if (item?.available === false) {
//   //       return `• ${item?.product.title}: *N/A*` // Show product as unavailable
//   //     }

//   //     const productWeight = item?.weight
//   //       ? `${item?.weight < 1 ? item?.weight * 1000 : item?.weight}${
//   //           item?.unit || ""
//   //         }`
//   //       : "N/A" // Format weight if available

//   //     return ` • ${item.quantity} x ${
//   //       item.product.title
//   //     } ${productWeight} - ${formatCurrency(item?.quantityTotal, "GHS")}`.trim()
//   //   })

//   const deliveryFee = formatCurrency(order.deliveryFee ?? 0, "GHS")

//   const totalAmount = formatCurrency(order?.total + order?.deliveryFee, "GHS")
//   //   const total = formatCurrency(totalAmount ?? 0, "GHS")

//   const creditBalance = formatCurrency(order?.creditAppliedTotal, "GHS")
//   const subtotal = formatCurrency(order?.total, "GHS")
//   const supportEmail = "support@sowgreen.com"
//   const worker_one = `${sowgreenWorkers[0].name} - ${sowgreenWorkers[0].phone}`
//   const worker_two = `${sowgreenWorkers[1].name} - ${sowgreenWorkers[1].phone}`

//   //   const variables = {
//   //     "1": customerName,
//   //     "2": orderNumber,
//   //     "3": deliveryDate,
//   //     "4": deliveryMethod,
//   //     "5": address,
//   //     "6": phone,
//   //     "7": orderSummary, // This now has bullet points but no line breaks
//   //     "8": creditBalance,
//   //     "9": subtotal,
//   //     "10": deliveryFee,
//   //     "11": total,
//   //     "12": supportEmail,
//   //   }

//   const variables = {
//     "1": customerName,
//     "2": orderNumber,
//     "3": deliveryDate,
//     "4": deliveryMethod,
//     "5": address,
//     "6": phone,
//     "7": itemsList[0], // This now has bullet points but no line breaks
//     "8": itemsList[1],
//     "9": itemsList[2],
//     "10": itemsList[3],
//     "11": itemsList[4],
//     "12": itemsList[5],
//     "13": itemsList[6],
//     "14": itemsList[7],
//     "15": itemsList[8],
//     "16": itemsList[9],
//     "17": itemsList[10],
//     "18": itemsList[11],
//     "19": itemsList[12],
//     "20": itemsList[13],
//     "21": itemsList[14],
//     "22": subtotal,
//     "23": deliveryFee,
//     "24": creditBalance,
//     "25": totalAmount,
//     "26": totalDue,
//     "27": worker_one,
//     "28": worker_two,
//   }

//   console.log(orderSummary, "orderSummary")
//   console.log(variables, "variables")

//   try {
//     const message = await client.messages.create({
//       from: `whatsapp:${whatsappNumber}`,
//       to: `whatsapp:${order.userWhatsappOptIn.customerPhone}`,
//       contentSid,
//       contentVariables: JSON.stringify(variables),
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

interface Order {
  shippingAddress: {
    name: string
    deliveryMethod?: string
    address: string
    city: string
    region: string
    phone: string
  }
  orderNumber: string
  deliveryDate: string
  products: Array<{
    product: {
      title: string
    }
    quantity: number
    weight?: number
    unit?: string
    quantityTotal: number
    available?: boolean
  }>
  deliveryFee?: number
  total: number
  updatedOrderTotal: number
  creditAppliedTotal: number
  userWhatsappOptIn: {
    customerPhone: string
  }
}
// export async function POST(req: Request) {
//   const order: Order = await req.json()

//   const shipping = order.shippingAddress
//   const customerName = shipping.name
//   const orderNumber = order.orderNumber
//   const deliveryDate = order.deliveryDate
//   const deliveryMethod = shipping.deliveryMethod || "Pickup"
//   const address = `${shipping.address}, ${shipping.city}, ${shipping.region}`
//   const phone = shipping.phone
//   const totalDue = formatCurrency(order?.updatedOrderTotal, "GHS")
//   const total_amount = order?.total + order?.deliveryFee
//   const credit_balance = order?.creditAppliedTotal

//   // Create order summary with bullet points using template literals
//   const orderSummary = order.products
//     .map((item: any) => {
//       const weight = item.weight ? `${item.weight}${item.unit}` : ""
//       return `• ${item.quantity} x ${
//         item.product.title
//       } ${weight} - ${formatCurrency(item?.quantityTotal, "GHS")}`.trim()
//     })
//     .join(",") // Use comma as separator but keep bullet points

//   const deliveryFee = formatCurrency(order.deliveryFee ?? 0, "GHS")

//   const totalAmount = formatCurrency(order?.total + order?.deliveryFee, "GHS")

//   const creditBalance = formatCurrency(order?.creditAppliedTotal, "GHS")
//   const subtotal = formatCurrency(order?.total, "GHS")
//   const supportEmail = "support@sowgreen.com"
//   const worker_one = `${sowgreenWorkers[0].name} - ${sowgreenWorkers[0].phone}`
//   const worker_two = `${sowgreenWorkers[1].name} - ${sowgreenWorkers[1].phone}`

//   const variables = {
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
//     "11": totalAmount,
//     "12": supportEmail,
//   }

//   try {
//     const message = await client.messages.create({
//       from: `whatsapp:${whatsappNumber}`,
//       to: `whatsapp:${order.userWhatsappOptIn.customerPhone}`,
//       contentSid,
//       contentVariables: JSON.stringify(variables),
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

export async function POST(req: Request) {
  const order: Order = await req.json()

  const shipping = order.shippingAddress
  const customerName = shipping.name
  const orderNumber = order.orderNumber
  const deliveryDate = order.deliveryDate
  const deliveryMethod = shipping.deliveryMethod || "Pickup"
  const address = `${shipping.address}, ${shipping.city}, ${shipping.region}`
  const phone = shipping.phone
  const totalDue = formatCurrency(order?.updatedOrderTotal, "GHS")
  const total_amount = order?.total + order?.deliveryFee
  const credit_balance = order?.creditAppliedTotal

  // In your API route or config file
  const TEMPLATE_MAP = (() => {
    try {
      const jsonStr = process.env.TWILIO_TEMPLATE_MAP_JSON
      return jsonStr ? JSON.parse(jsonStr) : {}
    } catch (e) {
      console.error("Failed to parse TWILIO_TEMPLATE_MAP_JSON")
      return {}
    }
  })()

  console.log(TEMPLATE_MAP, "TEMPLATE_MAP")

  // Create formatted order summary as a single string with newlines
  const orderSummary = order.products
    .slice(0, 10) // Limit to 10 items to avoid message being too long
    .map((item) => {
      if (!item?.product) {
        return "- Product details missing"
      }

      if (item?.available === false) {
        return `• ${item?.product.title}: *N/A*`
      }

      const productWeight = item?.weight
        ? `${item?.weight < 1 ? item?.weight * 1000 : item?.weight}${
            item?.unit || ""
          }`
        : ""

      return `• ${item.quantity} x ${
        item.product.title
      } ${productWeight} - ${formatCurrency(item?.quantityTotal, "GHS")}`
    })
    .join("\n") // Join with newlines to create single string

  // Add note if there are more items not shown
  const extraItemsNote =
    order.products.length > 10
      ? `\n\n+ ${order.products.length - 10} more items`
      : ""

  const deliveryFee = formatCurrency(order.deliveryFee ?? 0, "GHS")
  const totalAmount = formatCurrency(order?.total + order?.deliveryFee, "GHS")
  const creditBalance = formatCurrency(order?.creditAppliedTotal, "GHS")
  const subtotal = formatCurrency(order?.total, "GHS")
  const worker_one = `${sowgreenWorkers[0].name} - ${sowgreenWorkers[0].phone}`
  const worker_two = `${sowgreenWorkers[1].name} - ${sowgreenWorkers[1].phone}`

  const variables = {
    "1": customerName,
    "2": orderNumber,
    "3": deliveryDate,
    "4": deliveryMethod,
    "5": address,
    "6": phone,
    "7": orderSummary, // Combined string
    "8": subtotal,
    "9": deliveryFee,
    "10": creditBalance,
    "11": totalAmount,
    "12": totalDue,
    "13": worker_one,
    "14": worker_two,
  }

  try {
    const message = await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${order.userWhatsappOptIn.customerPhone}`,
      contentSid,
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
//   try {
//     const order = await req.json()

//     const shipping = order.shippingAddress
//     const customerName = shipping.name
//     const orderNumber = order.orderNumber
//     const deliveryDate = order.deliveryDate
//     const deliveryMethod = shipping.deliveryMethod || "Pickup"
//     const address = `${shipping.address}, ${shipping.city}, ${shipping.region}`
//     const phone = shipping.phone
//     const totalDue = formatCurrency(order?.updatedOrderTotal, "GHS")

//     const deliveryFee = formatCurrency(order.deliveryFee ?? 0, "GHS")
//     const totalAmount = formatCurrency(order.total + order.deliveryFee, "GHS")
//     const creditBalance = formatCurrency(order.creditAppliedTotal, "GHS")
//     const subtotal = formatCurrency(order.total, "GHS")
//     const worker_one = `${sowgreenWorkers[0].name} - ${sowgreenWorkers[0].phone}`
//     const worker_two = `${sowgreenWorkers[1].name} - ${sowgreenWorkers[1].phone}`

//     // Create product list (max 15 items)
//     const itemsList = order.products.map((item: any) => {
//       if (!item?.product) return "- Product details missing"
//       if (item.available === false) return `• ${item.product.title}: *N/A*`

//       const productWeight = item.weight
//         ? `${item.weight < 1 ? item.weight * 1000 : item.weight}${
//             item.unit || ""
//           }`
//         : "N/A"

//       return `• ${item.quantity} x ${
//         item.product.title
//       } ${productWeight} - ${formatCurrency(item.quantityTotal, "GHS")}`
//     })

//     // Fill up to 15 items with empty strings if needed
//     while (itemsList.length < 15) {
//       itemsList.push("")
//     }

//     // Create default contentVariables object with all keys from '1' to '28'
//     const defaultVars = Array.from({ length: 28 }, (_, i) =>
//       String(i + 1)
//     ).reduce((acc, key) => {
//       acc[key] = ""
//       return acc
//     }, {} as Record<string, string>)

//     // Merge defaults with real data
//     const contentVariables = {
//       ...defaultVars,
//       "1": customerName,
//       "2": orderNumber,
//       "3": deliveryDate,
//       "4": deliveryMethod,
//       "5": address,
//       "6": phone,
//       "7": itemsList[0],
//       "8": itemsList[1],
//       "9": itemsList[2],
//       "10": itemsList[3],
//       "11": itemsList[4],
//       "12": itemsList[5],
//       "13": itemsList[6],
//       "14": itemsList[7],
//       "15": itemsList[8],
//       "16": itemsList[9],
//       "17": itemsList[10],
//       "18": itemsList[11],
//       "19": itemsList[12],
//       "20": itemsList[13],
//       "21": itemsList[14],
//       "22": subtotal,
//       "23": deliveryFee,
//       "24": creditBalance,
//       "25": totalAmount,
//       "26": totalDue,
//       "27": worker_one,
//       "28": worker_two,
//     }

//     console.log(contentVariables, "contentVariables")

//     // Send WhatsApp message
//     const message = await client.messages.create({
//       from: `whatsapp:${whatsappNumber}`,
//       to: `whatsapp:${order.userWhatsappOptIn.customerPhone}`,
//       contentSid,
//       contentVariables: JSON.stringify(contentVariables),
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
