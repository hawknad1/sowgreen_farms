import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const from = formData.get("From") // Sender's phone number (string | File | null)
    const body = formData.get("Body") // SMS content (string | File | null)

    // Ensure `from` and `body` are strings
    if (typeof from !== "string" || typeof body !== "string") {
      throw new Error("Invalid message format: From or Body is not a string")
    }

    console.log(`Received SMS from ${from}: ${body}`)

    // Check for Facebook verification codes (now type-safe)
    if (body.includes("Facebook") || body.includes("code")) {
      console.log("Facebook verification code:", body)
      // Store in DB or process further
    }

    // Respond with empty TwiML (Twilio expects a response)
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { headers: { "Content-Type": "text/xml" } }
    )
  } catch (error) {
    console.error("Error handling SMS:", error)
    return NextResponse.json(
      { error: "Failed to process SMS" },
      { status: 500 }
    )
  }
}
