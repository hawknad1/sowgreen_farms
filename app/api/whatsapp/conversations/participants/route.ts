import twilioClient from "@/lib/twilio/twilio"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { conversationSid, userWhatsAppNumber } = await request.json() // userWhatsAppNumber e.g., "whatsapp:+12345678900"

    if (!twilioClient) {
      return NextResponse.json(
        { error: "Twilio client not initialized" },
        { status: 500 }
      )
    }
    if (!conversationSid || !userWhatsAppNumber) {
      return NextResponse.json(
        { error: "Missing conversationSid or userWhatsAppNumber" },
        { status: 400 }
      )
    }
    if (!process.env.TWILIO_WHATSAPP_NUMBER) {
      return NextResponse.json(
        { error: "Twilio WhatsApp sender number not configured" },
        { status: 500 }
      )
    }

    const participant = await twilioClient.conversations.v1
      .conversations(conversationSid)
      .participants.create({
        "messagingBinding.address": userWhatsAppNumber, // The user's WhatsApp number
        "messagingBinding.proxyAddress": process.env.TWILIO_WHATSAPP_NUMBER, // Your Twilio WhatsApp number
      })

    // You might want to add your business/agent as a chat participant too if they use a different interface
    // const agentParticipant = await client.conversations.v1.conversations(conversationSid)
    //   .participants
    //   .create({ identity: 'your_agent_identity' }); // Or another WhatsApp number

    return NextResponse.json({
      success: true,
      participantSid: participant.sid,
      conversationSid: participant.conversationSid,
    })
  } catch (error) {
    console.error("Error adding user to conversation:", error)
    return NextResponse.json(
      { error: `Failed to add user: ${error}` },
      { status: 500 }
    )
  }
}
