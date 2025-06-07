// import twilioClient from "@/lib/twilio/twilio"
// import { NextResponse } from "next/server"

// export async function DELETE(
//   req: Request,
//   { params }: { params: { conversationSid: string } }
// ) {
//   const { participantSid } = await req.json()
//   const { conversationSid } = params

//   //   const conversationSid = process.env.ORDER_TARGET_CONVERSATION_SID
//   try {
//     const participants = await twilioClient.conversations.v1
//       .conversations(conversationSid)
//       .participants(participantSid)
//       .remove()

//     console.log("Participants:", participants)

//     return NextResponse.json(
//       { message: "Participant removed", participants },
//       { status: 200 }
//     )
//   } catch (error) {
//     console.error("Error listing participants:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch participants." },
//       { status: 500 }
//     )
//   }
// }

import { NextResponse } from "next/server"
import twilioClient from "@/lib/twilio/twilio"
import { z } from "zod"
import prisma from "@/lib/prismadb"

// Input validation schema
const DeleteParticipantSchema = z.object({
  participantSid: z.string().min(1, "Participant SID is required"),
})

export async function DELETE(
  req: Request,
  { params }: { params: { conversationSid: string } }
) {
  const { conversationSid } = params

  try {
    // Validate input
    const requestBody = await req.json()
    const validation = DeleteParticipantSchema.safeParse(requestBody)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      )
    }

    const { participantSid } = validation.data

    const conversation = await prisma.conversation.findUnique({
      where: { twilioSid: conversationSid },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      )
    }

    const dbParticipant = await prisma.conversationParticipant.findFirst({
      where: {
        twilioParticipantSid: participantSid,
        conversationId: conversation.id, // Use the MongoDB ID here
      },
    })
    // // Validate conversationSid from params
    // if (!conversationSid) {
    //   return NextResponse.json(
    //     { error: "Conversation SID is required" },
    //     { status: 400 }
    //   )
    // }

    // // Step 1: Find the participant in our database first
    // const dbParticipant = await prisma.conversationParticipant.findFirst({
    //   where: {
    //     twilioParticipantSid: participantSid,
    //     conversationId: conversationSid,
    //   },
    //   include: {
    //     conversation: true,
    //   },
    // })

    if (!dbParticipant) {
      return NextResponse.json(
        { error: "Participant not found in database" },
        { status: 404 }
      )
    }

    // Step 2: Remove from Twilio conversation
    await twilioClient.conversations.v1
      .conversations(conversationSid)
      .participants(participantSid)
      .remove()

    // Step 3: Delete from our database
    await prisma.conversationParticipant.delete({
      where: {
        id: dbParticipant.id,
      },
    })

    return NextResponse.json(
      {
        message: "Participant removed successfully",
        deletedParticipant: {
          id: dbParticipant.id,
          sid: participantSid,
          address: dbParticipant.messagingBindingAddress,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error deleting participant:", error)

    // Handle Twilio-specific errors
    if (error.code === 20404) {
      return NextResponse.json(
        { error: "Participant not found in Twilio conversation" },
        { status: 404 }
      )
    }

    // Handle Prisma errors
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Participant not found in database" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        error: "Failed to delete participant",
        details: error.message,
      },
      { status: 500 }
    )
  }
}
