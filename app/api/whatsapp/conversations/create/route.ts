import twilioClient from "@/lib/twilio/twilio"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { friendlyName } = await request.json() // e.g., "Support Chat XYZ"

    if (!twilioClient) {
      return NextResponse.json(
        { error: "Twilio client not initialized" },
        { status: 500 }
      )
    }

    const conversation =
      await twilioClient.conversations.v1.conversations.create({
        friendlyName: friendlyName || "My WhatsApp Group Chat",
        // You can also set attributes here if needed
        // attributes: JSON.stringify({ topic: 'customer_support' })
      })

    return NextResponse.json({
      success: true,
      conversationSid: conversation.sid,
      friendlyName: conversation.friendlyName,
    })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json(
      { error: `Failed to create conversation: ${error}` },
      { status: 500 }
    )
  }
}
