import twilioClient from "@/lib/twilio/twilio"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { friendlyName } = await request.json() // e.g., "My Awesome Group"

    if (!friendlyName) {
      return NextResponse.json(
        { error: "Friendly name is required" },
        { status: 400 }
      )
    }

    const conversation =
      await twilioClient.conversations.v1.conversations.create({
        friendlyName: friendlyName,
      })

    console.log("Created conversation:", conversation.sid)
    return NextResponse.json({
      success: true,
      conversationSid: conversation.sid,
      friendlyName: conversation.friendlyName,
    })
  } catch (error) {
    console.error("Error creating conversation:", error)
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json(
      { error: "Failed to create conversation", details: errorMessage },
      { status: 500 }
    )
  }
}
