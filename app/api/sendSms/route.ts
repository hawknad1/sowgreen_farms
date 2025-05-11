import { NextResponse } from "next/server"
import twilio from "twilio"

export async function POST(req: Request) {
  // 1. Initialize with your direct credentials
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const client = twilio(accountSid, authToken)

  try {
    const { message, to } = await req.json()

    // 2. Validate and format number (Ghana specific)
    const formattedTo = to.startsWith("+233")
      ? to
      : to.startsWith("0")
      ? `+233${to.substring(1)}`
      : `+233${to}`

    // 3. Send with delivery tracking
    const messageResponse = await client.messages.create({
      body: message,
      from: "+17623443847",
      to: formattedTo,
      statusCallback: "https://yourdomain.com/api/twilio-status", // Add webhook URL
      validityPeriod: 14400, // 4 hour delivery window
    })

    // 4. Enhanced response with delivery diagnostics
    return NextResponse.json({
      success: true,
      sid: messageResponse.sid,
      status: messageResponse.status,
      to: formattedTo,
      debug: {
        twilioResponse: messageResponse,
        deliveryCheck: `https://console.twilio.com/us1/monitor/logs/messages/${messageResponse.sid}`,
        carrierLookup: `https://lookups.twilio.com/v2/PhoneNumbers/${formattedTo}?Fields=carrier`,
      },
    })
  } catch (error) {
    // 5. Comprehensive error diagnostics
    console.error("Twilio Delivery Failure:", {
      error: error,
      code: error,
      moreInfo: error,
      stack: error,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Delivery failed",
        diagnostics: {
          code: error || "unknown",
          //   carrierInfo: await getCarrierInfo(formattedTo, client),
          actionItems: [
            "Check number in Twilio console: https://console.twilio.com/phone-numbers/incoming",
            "Verify carrier status: https://www.twilio.com/docs/glossary/blacklist",
            "Test with alternative number",
          ],
        },
      },
      { status: 500 }
    )
  }
}

// Helper function to check carrier info
async function getCarrierInfo(phoneNumber: string, client: any) {
  try {
    const lookup = await client.lookups.v2
      .phoneNumbers(phoneNumber)
      .fetch({ fields: "carrier" })
    return lookup.carrier
  } catch {
    return "Carrier lookup failed"
  }
}
