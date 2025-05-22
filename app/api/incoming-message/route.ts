import { generateOrderConfirmationMessage } from "@/lib/actions/whatsAppMessages/generateOrderConfirmationMessage"
import { Order } from "@/types"
import { NextRequest, NextResponse } from "next/server"
import { Twilio } from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER!

const twilioClient = new Twilio(accountSid, authToken)

async function getFullOrderDetails(orderId: string): Promise<Order | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${orderId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    )

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

    const messageTemplate = generateOrderConfirmationMessage(order)

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
