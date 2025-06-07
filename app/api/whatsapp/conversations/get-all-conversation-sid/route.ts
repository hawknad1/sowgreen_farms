import twilioClient from "@/lib/twilio/twilio"

export async function GET() {
  try {
    const conversations =
      await twilioClient.conversations.v1.conversations.list()

    const result = conversations.map((conv) => ({
      sid: conv.sid,
      friendlyName: conv.friendlyName,
      dateCreated: conv.dateCreated,
    }))

    console.log("Conversations:", result)
    return Response.json({ conversations: result }, { status: 200 })
  } catch (error) {
    console.error("Failed to list conversations:", error)
    return Response.json(
      { error: "Error fetching conversations" },
      { status: 500 }
    )
  }
}
