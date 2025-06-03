import twilioClient from "@/lib/twilio/twilio"
import { NextResponse } from "next/server"

const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_SENDER // Your Twilio WhatsApp sender

export async function POST(request: Request) {
  try {
    const { conversationSid, participantWhatsAppNumber } = await request.json() // e.g., "CHxxxx", "whatsapp:+12345678900"

    if (!conversationSid || !participantWhatsAppNumber) {
      return NextResponse.json(
        {
          error:
            "Conversation SID and participant WhatsApp number are required",
        },
        { status: 400 }
      )
    }

    if (!participantWhatsAppNumber.startsWith("whatsapp:")) {
      return NextResponse.json(
        {
          error:
            'Participant number must be in E.164 format prefixed with "whatsapp:" (e.g., whatsapp:+12345678900)',
        },
        { status: 400 }
      )
    }

    const participant = await twilioClient.conversations.v1
      .conversations(conversationSid)
      .participants.create({
        "messagingBinding.address": participantWhatsAppNumber,
        "messagingBinding.proxyAddress": twilioWhatsAppNumber,
      })

    console.log(
      "Added participant:",
      participant.sid,
      "to conversation:",
      conversationSid
    )
    return NextResponse.json({
      success: true,
      participantSid: participant.sid,
      conversationSid: conversationSid,
    })
  } catch (error) {
    console.error("Error adding participant:", error)
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json(
      { error: "Failed to add participant", details: errorMessage },
      { status: 500 }
    )
  }
}
