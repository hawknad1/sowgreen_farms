import { NextResponse } from "next/server"
import twilio from "twilio"

export async function POST(req: Request) {
  // Parse the request body
  const { message, customerNumber } = await req.json()

  // Validate input
  if (!message || !customerNumber) {
    return NextResponse.json(
      { message: "Message and customerNumber are required" },
      { status: 400 }
    )
  }

  // Validate Twilio credentials
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN

  if (!accountSid || !authToken) {
    return NextResponse.json(
      { message: "Twilio credentials are missing" },
      { status: 500 }
    )
  }

  // Initialize Twilio client
  const client = twilio(accountSid, authToken)

  try {
    // Send the WhatsApp message
    const response = await client.messages.create({
      body: message,
      from: "whatsapp:+233553121737", // Your Twilio WhatsApp number
      to: `whatsapp:+233${customerNumber}`, // Dynamic recipient number
    })

    // Return success response
    return NextResponse.json(
      {
        message: "WhatsApp message sent successfully",
        sid: response.sid,
      },
      { status: 200 }
    )
  } catch (error) {
    // Log the error for debugging
    console.error("Error sending WhatsApp message:", error)

    // Return error response
    return NextResponse.json(
      {
        message: "Failed to send WhatsApp message",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
