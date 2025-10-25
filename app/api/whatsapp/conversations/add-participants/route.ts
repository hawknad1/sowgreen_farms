import prisma from "@/lib/prismadb"
import twilioClient from "@/lib/twilio/twilio"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // const conversationSid = process.env.ORDER_TARGET_CONVERSATION_SID

  try {
    // const { userWhatsAppNumber } = await request.json() // userWhatsAppNumber e.g., "whatsapp:+12345678900"
    const { userWhatsAppNumber, name, conversationSid } = await request.json() // Added name field

    console.log(userWhatsAppNumber, "userWhatsAppNumber")
    console.log(name, "name")
    console.log(conversationSid, "conversationSid")

    // console.log(name, "name")

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

    // First find or create the contact
    const contact = await prisma.contact.upsert({
      where: { phoneNumber: userWhatsAppNumber },
      create: {
        phoneNumber: userWhatsAppNumber,
        name: name || "Unknown", // Default name if not provided
      },
      update: {}, // No updates needed if contact exists
    })

    if (!contact) {
      await prisma.contact.create({
        data: {
          name,
          phoneNumber: userWhatsAppNumber,
        },
      })
    }

    // Find the conversation in our DB by Twilio SID
    const conversation = await prisma.conversation.findUnique({
      where: { twilioSid: conversationSid },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found in database" },
        { status: 404 }
      )
    }

    console.log(conversationSid, "conversationSid")

    const participant = await twilioClient.conversations.v1
      .conversations(conversationSid)
      .participants.create({
        "messagingBinding.address": userWhatsAppNumber, // The user's WhatsApp number
        "messagingBinding.proxyAddress":
          process.env.TWILIO_WHATSAPP_CONVERSATION_NUMBER, // Your Twilio WhatsApp number
      })

    // Save participant to our DB
    await prisma.conversationParticipant.create({
      data: {
        // contactId: contact?.id,
        twilioParticipantSid: participant.sid,
        messagingBindingAddress: userWhatsAppNumber,
        conversationId: conversation.id,
        name,
      },
    })

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
