import twilioClient from "@/lib/twilio/twilio"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { conversationSid: string } }
) {
  // const conversationSid = process.env.ORDER_TARGET_CONVERSATION_SID
  const { conversationSid } = params

  try {
    const participants = await twilioClient.conversations.v1
      .conversations(conversationSid)
      .participants.list()

    const result = participants.map((p) => ({
      sid: p.sid,
      identity: p.identity,
    }))

    if (!result)
      return NextResponse.json({ messafe: "There are no participants" })

    return NextResponse.json({ participants: result }, { status: 200 })
  } catch (error) {
    console.error("Error listing participants:", error)
    return NextResponse.json(
      { error: "Failed to fetch participants." },
      { status: 500 }
    )
  }
}
