import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { phone } = await req.json()

    if (!phone) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 })
    }

    // Find the participant in your database
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        messagingBindingAddress: phone,
      },
      include: {
        conversation: true,
      },
    })

    if (!participant) {
      return NextResponse.json(
        { message: "Participant not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      participantSid: participant.twilioParticipantSid,
      conversation: participant.conversation,
    })
  } catch (error) {
    console.error("Error finding participant:", error)
    return NextResponse.json(
      { error: "Failed to find participant" },
      { status: 500 }
    )
  }
}
