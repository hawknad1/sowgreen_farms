import { generateOrderConfirmationMessage } from "@/lib/actions/whatsAppMessages/generateOrderConfirmationMessage"
import { Order, ShippingAddress } from "@/types"
import { NextRequest, NextResponse } from "next/server"
import { Twilio } from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER!

const twilioClient = new Twilio(accountSid, authToken)

interface Product {
  id: string
  name: string
  quantity: number
  price: number
}

// interface Order {
//   id: string
//   products: Product[]
//   customerName?: string
// }

// interface Product {
//   quantity: number
//   quantityTotal: number
//   available: boolean
//   weight?: number
//   unit?: string
//   price: number
//   product: {
//     title: string
//   }
// }

// export type ProductOrder = {
//   item: {
//     id: string
//     title: string
//     categoryName: string
//     description: string
//     imageUrl: string
//     price: number
//     weight: number
//     unit: string
//     isInStock: string
//     discount: number
//     quantity: number
//     purchaseCount: number
//     createdAt: string
//     updatedAt: string
//   }
//   total: number
//   quantity: number
// }

// export type Order = {
//   id?: string
//   orderNumber: string
//   referenceNumber?: string
//   total: number
//   status?: "processing" | "shipped" | "delivered"
//   dispatchRider?: string
//   deliveryMethod: string
//   deliveryFee: number
//   cardType?: string
//   last4Digits?: string
//   paymentMode?: string
//   paymentAction?: string
//   shippingAddress: ShippingAddress
//   products: Product[] // Change from Product[] to ProductOrder[]
//   createdAt?: string
// }

async function getFullOrderDetails(orderId: string): Promise<Order | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
      method: "GET",
      cache: "no-store",
    })

    if (!res.ok) throw new Error("Failed to fetch order details")

    return await res.json()
  } catch (error) {
    console.error("Error fetching order details:", error)
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const from = formData.get("From") as string
    const buttonPayload = formData.get("ButtonPayload") as string
    const messageSid = formData.get("MessageSid") as string

    if (!from || !buttonPayload) {
      console.warn("Missing 'From' or 'ButtonPayload' in Twilio webhook.")
      return NextResponse.json(
        { success: false, message: "Missing required webhook fields." },
        { status: 400 }
      )
    }

    console.log("Twilio Button Click Received:", {
      from,
      buttonPayload,
      messageSid,
    })

    const order = await getFullOrderDetails(buttonPayload)

    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order not found for ID: ${buttonPayload}` },
        { status: 404 }
      )
    }

    // const messageLines = [
    //   `Hi${
    //     order.customerName ? ` ${order.customerName}` : ""
    //   }, here is your order summary (Order #${order.id}):\n`,
    // ]

    // if (order.products.length > 0) {
    //   order.products.forEach((p, i) =>
    //     messageLines.push(
    //       `${i + 1}. ${p.name} (Qty: ${p.quantity}) - $${p.price.toFixed(2)}`
    //     )
    //   )
    // } else {
    //   messageLines.push("No products found in this order.")
    // }

    // const totalQty = order.products.reduce((sum, p) => sum + p.quantity, 0)
    // const subtotal = order.products.reduce(
    //   (sum, p) => sum + p.price * p.quantity,
    //   0
    // )

    // messageLines.push(`\nTotal Items: ${totalQty}`)
    // messageLines.push(`Subtotal: $${subtotal.toFixed(2)}`)
    // messageLines.push("\nIf you have any questions, please contact support.")

    // let messageBody = messageLines.join("\n")
    // if (messageBody.length > 4000) {
    //   messageBody = messageBody.slice(0, 3990) + "\n... (message truncated)"
    // }

    const messageTemplate = generateOrderConfirmationMessage(order)
    console.log(messageTemplate, "messageTemplate")
    console.log(order, "order")

    const response = await twilioClient.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: from,
      body: messageTemplate,
    })

    return NextResponse.json({ success: true, messageSid: response.sid })
  } catch (error: any) {
    console.error("Webhook Error:", error)

    let message = "Unexpected server error."

    if (error?.message) message = error.message
    if (error?.response?.data?.message) message = error.response.data.message
    if (error?.moreInfo) {
      message = `Twilio API Error: ${error.message} (Code: ${error.code}) - More info: ${error.moreInfo}`
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Twilio WhatsApp webhook endpoint is working.",
    instructions:
      "Send a POST request from Twilio to handle button interactions.",
  })
}
