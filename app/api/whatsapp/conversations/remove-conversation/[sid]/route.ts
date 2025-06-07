import prisma from "@/lib/prismadb"
import twilioClient from "@/lib/twilio/twilio"
import { NextResponse } from "next/server"

// export async function DELETE() {
//   try {
//     const conversations =
//       await twilioClient.conversations.v1.conversations.list()

//     await Promise.all(
//       conversations.map((conv) =>
//         twilioClient.conversations.v1.conversations(conv.sid).remove()
//       )
//     )

//     console.log("✅ All conversations deleted.")
//     return Response.json(
//       { message: "All conversations deleted" },
//       { status: 200 }
//     )
//   } catch (error) {
//     console.error("Error deleting conversations:", error)
//     return Response.json(
//       { error: "Failed to delete conversations" },
//       { status: 500 }
//     )
//   }
// }

export async function DELETE(
  request: Request,
  { params }: { params: { sid: string } }
) {
  const { sid } = params

  try {
    const findSid = await prisma.conversation.findUnique({
      where: {
        twilioSid: sid,
      },
    })

    if (!findSid)
      return NextResponse.json({
        message: `Couldnt find conversation sid: ${sid}`,
      })

    await twilioClient.conversations.v1.conversations(sid).remove()
    console.log(`✅ Conversation ${sid} deleted`)
    return NextResponse.json(
      { message: `Conversation ${sid} deleted` },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Error deleting conversation:", error)
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    )
  }
}
