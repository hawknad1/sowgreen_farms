import { generateOrderConfirmationMessage } from "@/lib/actions/whatsAppMessages/generateOrderConfirmationMessage"
import prisma from "@/lib/prismadb"
import { Order, RepliedNote } from "@/types"
import { NextRequest, NextResponse } from "next/server"
import { Twilio } from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const whatsappNumber = process.env.TWILIO_WHATSAPP_SENDER
const twilioClient = new Twilio(accountSid, authToken)
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// Define the maximum number of products per WhatsApp message
// Based on your testing, 30 products seems to be a safe number to avoid the 1600 character limit.
const PRODUCTS_PER_MESSAGE = 30

// --- Helper Function to Fetch Order Details ---
async function getFullOrderDetails(orderId: string): Promise<Order | null> {
  try {
    // Ensure NEXT_PUBLIC_BASE_URL is correctly set in your .env file
    const res = await fetch(
      `${baseUrl}/api/orders/${orderId}`, // Adjust path to your order API
      {
        method: "GET",
        cache: "no-store", // Ensure fresh data
      }
    )

    if (!res.ok) {
      // Log the error response from your API if available
      const errorData = await res.text() // Get raw error response
      throw new Error(
        `Failed to fetch order details: ${res.status} ${res.statusText} - ${errorData}`
      )
    }

    return await res.json()
  } catch (error) {
    console.error("Error fetching order details:", error)
    return null
  }
}

function formatReplies(replies: RepliedNote[]) {
  return replies
    .map(
      (r) =>
        `[${new Date(r.timestamp).toLocaleString()}]\n${r.sender}: ${r.text}`
    )
    .join("\n\n")
}

function formatReply(reply: RepliedNote) {
  return `[${new Date(reply.timestamp).toLocaleString()}]\n${reply.sender}: ${reply.text}`
}

// --- POST Handler for Twilio Webhook ---
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const from = formData.get("From") as string // Customer's WhatsApp number (e.g., whatsapp:+1234567890)
    const buttonPayload = formData.get("ButtonPayload") as string // The order ID sent as payload
    const messageSid = formData.get("MessageSid") as string // SID of the incoming Twilio message

    // Basic validation
    if (!from || !buttonPayload) {
      console.warn("Missing 'From' or 'ButtonPayload' in Twilio webhook.")
      return NextResponse.json(
        { success: false, message: "Missing required webhook fields." },
        { status: 400 }
      )
    }

    console.log("Twilio Button Click Received:", {
      from,
      buttonPayload,
      messageSid,
    })

    // // Fetch the complete order details
    // const order = await getFullOrderDetails(buttonPayload)

    // if (!order) {
    //   console.error(`Order not found for ID: ${buttonPayload}`)
    //   return NextResponse.json(
    //     { success: false, error: `Order not found for ID: ${buttonPayload}` },
    //     { status: 404 }
    //   )
    // }

    // --- LOGIC TO DIFFERENTIATE ACTIONS ---
    // highlight-start
    if (buttonPayload.startsWith("reply_to_")) {
      // --- Handle "View Reply" Button Click ---
      const orderId = buttonPayload.split("_")[2] // Extracts the order ID
      // console.log(`Handling reply request for order: ${orderId}`)

      // // Fetch the complete order details
      // const order = await getFullOrderDetails(orderId)

      // if (!order) {
      //   console.error(`Order not found for ID: ${buttonPayload}`)
      //   return NextResponse.json(
      //     { success: false, error: `Order not found for ID: ${buttonPayload}` },
      //     { status: 404 }
      //   )
      // }

      // // Format the replied notes for display
      // const formattedNotes =
      //   order.repliedNotes
      //     ?.map(
      //       (note) =>
      //         `[${new Date(note.timestamp).toLocaleString()}] ${note.sender}: ${note.text}`
      //     )
      //     .join("\n\n") || "No replies yet"
      // // Here you can save a notification to your database.

      // // You can optionally send a confirmation message back to the user
      // await twilioClient.messages.create({
      //   from: `whatsapp:${whatsappNumber}`,
      //   to: from,
      //   // body: "Thanks! Our team will get back to you shortly.",
      //   body: `Your order #${order.orderNumber} replies:\n\n${formattedNotes}`,
      // })

      // const order = await getFullOrderDetails(orderId)

      // 1. First mark all replies as read
      // 1. Mark replies as read
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { repliedNotes: true, orderNumber: true },
      })

      if (!order) {
        console.error(`Order not found: ${orderId}`)
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      const updatedNotes = order.repliedNotes.map((note) => ({
        ...note,
        read: true,
        readAt: note.read ? note.readAt : new Date(),
      }))

      await prisma.order.update({
        where: { id: orderId },
        data: { repliedNotes: updatedNotes },
      })

      // 2. Send the latest reply
      const lastReply = updatedNotes[updatedNotes.length - 1]
      const messageText = `Your order #${order.orderNumber} reply:\n\n${lastReply.sender}: ${lastReply.text}`

      // 2. Fetch the order with updated read status

      // 3. Filter to only unread messages (should be empty now)
      const unreadReplies = order.repliedNotes.filter((note) => !note.read)

      // 4. Or get the last message if you prefer
      // const lastReply = order.repliedNotes[order.repliedNotes.length - 1]

      // Format the message to send
      // const messageToSend =
      //   unreadReplies.length > 0
      //     ? `New replies:\n\n${formatReplies(unreadReplies)}`
      //     : `Latest reply:\n\n${formatReply(lastReply)}`

      await twilioClient.messages.create({
        from: `whatsapp:${whatsappNumber}`,
        to: from,
        body: messageText,
      })

      return NextResponse.json({
        success: true,
        action: "reply_request_logged",
      })
      // highlight-end
    } else {
      // Fetch the complete order details
      const order = await getFullOrderDetails(buttonPayload)

      if (!order) {
        console.error(`Order not found for ID: ${buttonPayload}`)
        return NextResponse.json(
          { success: false, error: `Order not found for ID: ${buttonPayload}` },
          { status: 404 }
        )
      }
      const totalProducts = order.products.length
      let sentMessageSids: string[] = [] // To store SIDs of all messages sent

      // Loop to send messages in batches
      for (let i = 0; i < totalProducts; i += PRODUCTS_PER_MESSAGE) {
        const startIndex = i
        const endIndex = Math.min(i + PRODUCTS_PER_MESSAGE, totalProducts)

        // Generate the message content for the current batch of products
        const messageTemplate = generateOrderConfirmationMessage(
          order,
          startIndex,
          endIndex
        )

        console.log(
          `Sending message for order ${order.orderNumber}: products ${
            startIndex + 1
          }-${endIndex}`
        )

        // Send the WhatsApp message via Twilio
        const response = await twilioClient.messages.create({
          from: `whatsapp:${whatsappNumber}`, // Your Twilio WhatsApp number
          to: from, // Customer's WhatsApp number
          body: messageTemplate,
        })

        sentMessageSids.push(response.sid)
        console.log(`Message SID: ${response.sid}`)

        // IMPORTANT: Add a small delay between messages to avoid Twilio rate limiting
        // and ensure messages are delivered in order, especially for larger batches.
        if (endIndex < totalProducts) {
          await new Promise((resolve) => setTimeout(resolve, 1000)) // 1-second delay
        }
      }

      // Return success response with all message SIDs
      return NextResponse.json({ success: true, messageSids: sentMessageSids })
    }
  } catch (error: any) {
    console.error("Webhook Error:", error)

    // --- Enhanced Error Handling for Twilio API Errors ---
    let message = "An unexpected server error occurred."

    if (error?.message) {
      message = error.message
    }
    // Check for Twilio specific error response structure
    if (error?.response?.data?.message) {
      message = `Twilio Error: ${error.response.data.message}`
    }
    if (error?.moreInfo) {
      message = `Twilio API Error: ${error.message} (Code: ${error.code}) - More info: ${error.moreInfo}`
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

// --- GET Handler (for testing/info) ---
export async function GET() {
  return NextResponse.json({
    message: "Twilio WhatsApp webhook endpoint is working.",
    instructions:
      "Send a POST request from Twilio to handle button interactions.",
  })
}
