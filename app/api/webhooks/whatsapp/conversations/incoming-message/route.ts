// import { NextResponse } from "next/server"

// // It's crucial to validate Twilio requests in production
// // This is a simplified example. In production, use the 'twilio' helper library for validation.
// // const authToken = process.env.TWILIO_AUTH_TOKEN;

// export async function POST(request: Request) {
//   const body = await request.formData() // Twilio webhooks usually send form data
//   const twilioSignature = request.headers.get("x-twilio-signature")
//   const url = request.url // Or construct the full URL as Twilio expects it for validation

//   // IMPORTANT: Validate Twilio Request (see Twilio docs for robust validation)
//   // This is a conceptual placeholder for validation.
//   // In a real app, you MUST validate the signature.
//   // const params = Object.fromEntries(body);
//   // if (!Webhook.validateRequest(authToken, twilioSignature, url, params)) {
//   //   return NextResponse.json({ error: 'Invalid Twilio signature.' }, { status: 403 });
//   // }

//   try {
//     const messageSid = body.get("MessageSid")
//     const conversationSid = body.get("ConversationSid") // This should be populated by Twilio if the sender is part of a Conversation
//     const author = body.get("Author") || body.get("From") // WhatsApp number of the sender e.g. whatsapp:+1234567890
//     const messageBody = body.get("Body")
//     const mediaUrl = body.get("MediaUrl0") // If there's media

//     console.log("Received Incoming WhatsApp Message:")
//     console.log("Conversation SID:", conversationSid)
//     console.log("Message SID:", messageSid)
//     console.log("Author:", author)
//     console.log("Body:", messageBody)
//     if (mediaUrl) {
//       console.log("Media URL:", mediaUrl)
//     }

//     // **Your Logic Here:**
//     // 1. Store the message in your database, associated with the conversationSid.
//     // 2. Trigger notifications to other participants/agents.
//     // 3. Implement any auto-responses or bot logic.

//     // If the incoming message is NOT yet part of a Conversation,
//     // Twilio might be configured to hit a different webhook (e.g., on the Messaging Service).
//     // If `ConversationSid` is not present, you might need to:
//     //   - Find an existing conversation for this user.
//     //   - Or, create a new conversation and add this user.
//     //   - Then, potentially add the message to that conversation programmatically.
//     //   This example assumes the number is already associated with a conversation.

//     // You typically don't send a TwiML response from this webhook when using Conversations API directly for message handling.
//     // The message is already in the Conversation. If you need to reply, use the send-message API.
//     // Sending an empty response is usually fine.
//     return new NextResponse(null, { status: 204 }) // 204 No Content is often used
//   } catch (error) {
//     console.error("Error processing incoming message webhook:", error)
//     return NextResponse.json(
//       { error: "Failed to process webhook" },
//       { status: 500 }
//     )
//   }
// }

import twilioClient from "@/lib/twilio/twilio"
import { NextResponse } from "next/server"
import twilio from "twilio" // Default import for accessing helper functions

const authToken = process.env.TWILIO_AUTH_TOKEN

export async function POST(request: Request) {
  if (!authToken) {
    console.error("TWILIO_AUTH_TOKEN is not set. Webhook validation will fail.")
    return NextResponse.json({ error: "Configuration error." }, { status: 500 })
  }

  const body = await request.formData()
  const twilioSignature = request.headers.get("x-twilio-signature")
  const url = request.url

  // --- MODIFIED: Create params object using FormData.forEach and broader typing ---
  const params: Record<string, any> = {} // Use Record<string, any> for broader compatibility
  body.forEach((value, key) => {
    if (typeof value === "string") {
      params[key] = value
    } else {
    }
  })
  // --- END MODIFICATION ---

  const isTwilioRequest = twilio.validateRequest(
    authToken,
    twilioSignature || "",
    url,
    params
  )

  if (!isTwilioRequest) {
    console.warn("Invalid Twilio signature. Request denied.", {
      url,
      params,
      twilioSignature,
    })
    return NextResponse.json(
      { error: "Invalid Twilio signature." },
      { status: 403 }
    )
  }

  try {
    const webhookEventType = params["EventType"] as string // Access properties from 'params'

    if (webhookEventType === "onMessageAdded") {
      const originalAuthor = params["Author"] as string
      const originalMessageBody = params["Body"] as string
      const conversationSid = params["ConversationSid"] as string
      const participantSid = params["ParticipantSid"] as string // Corrected access
      const messageSid = params["MessageSid"] as string
      const whatsAppProfileName = params["ProfileName"] as string | null

      console.log(`Webhook Event: ${webhookEventType}`)
      console.log(`  Conversation SID: ${conversationSid}`)
      console.log(`  Original Message SID: ${messageSid}`)
      console.log(`  Original Author: ${originalAuthor}`)
      console.log(`  Original Participant SID: ${participantSid}`) // Now correctly accessed
      console.log(`  Original Body: ${originalMessageBody}`)
      if (whatsAppProfileName) {
        console.log(`  WhatsApp Profile Name: ${whatsAppProfileName}`)
      }

      if (originalAuthor === "system_formatter" || !originalAuthor) {
        console.log(
          "Skipping formatting for message from system_formatter or unknown/empty author."
        )
        return new NextResponse(null, { status: 204 })
      }

      if (!twilioClient) {
        console.error(
          "Twilio client not initialized. Cannot send formatted message."
        )
        return new NextResponse(null, { status: 200 })
      }

      if (originalMessageBody && conversationSid) {
        // Make sure getSenderDisplayName is defined in your file or imported
        const senderDisplayName = await getSenderDisplayName(
          originalAuthor,
          whatsAppProfileName
        )
        const formattedBody = `${senderDisplayName}: ${originalMessageBody}`

        try {
          const sentMessage = await twilioClient.conversations.v1
            .conversations(conversationSid)
            .messages.create({
              body: formattedBody,
              author: "system_formatter",
            })
          console.log(
            `Sent formatted message (SID: ${sentMessage.sid}) to ${conversationSid}: "${formattedBody}"`
          )
        } catch (sendMessageError) {
          console.error(
            "Error sending formatted message via Twilio API:",
            sendMessageError
          )
        }
      }
    } else {
      console.log(
        `Received webhook event type: ${webhookEventType} - not processing for formatting.`
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error processing incoming message webhook:", error)
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    )
  }
}

// Ensure getSenderDisplayName function is defined here or imported correctly
async function getSenderDisplayName(
  author: string,
  profileName?: string | null
): Promise<string> {
  if (!author) return "Unknown Sender"
  // Implement your actual user lookup logic here
  if (profileName) return profileName
  if (author.startsWith("whatsapp:")) return author.substring(9)
  return author
}
