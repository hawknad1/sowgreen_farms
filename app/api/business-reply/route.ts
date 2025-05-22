import { formatProductLine } from "@/lib/formatters"
import { cache } from "@/lib/twilio/cache"
import { NextRequest, NextResponse } from "next/server"
import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER!
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID!
const DEBUG = process.env.NODE_ENV !== "production"

const client = twilio(accountSid, authToken)

export async function POST(req: NextRequest) {
  try {
    const { customerNumber, message } = await req.json()
    const products = cache.getOrder(customerNumber)

    if (!products) {
      return NextResponse.json(
        { success: false, error: "Order data expired" },
        { status: 400 }
      )
    }

    // Send products as freeform message
    const productList = products
      .map((p, i) => `${i + 1}. ${formatProductLine(p, 40)}`)
      .join("\n")

    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${customerNumber}`,
      body: `Here's your complete order:\n\n${productList}`,
    })

    cache.deleteOrder(customerNumber)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Business reply error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
