import { auth } from "@/auth"
import twilioClient from "@/lib/twilio/twilio"
import { NextResponse } from "next/server"

const whatsappNumber = process.env.TWILIO_WHATSAPP_SENDER!

export async function POST(req: Request) {
  try {
    const session = await auth()
    const { to, message, order } = await req.json()

    // Send direct message (not using template)
    const whatsappMessage = await twilioClient.messages.create({
      body: message, // Direct message content
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${to}`,
    })

    return NextResponse.json({
      success: true,
      sid: whatsappMessage.sid,
    })
  } catch (error: any) {
    console.error("Twilio Error:", error)
    return NextResponse.json(
      { error: "Failed to send message", details: error.message },
      { status: 500 }
    )
  }
}
