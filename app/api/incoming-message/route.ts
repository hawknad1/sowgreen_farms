// import { generateOrderConfirmationMessage } from "@/lib/actions/whatsAppMessages/generateOrderConfirmationMessage"
// import { Order } from "@/types"
// import { NextRequest, NextResponse } from "next/server"
// import { Twilio } from "twilio"

// const accountSid = process.env.TWILIO_ACCOUNT_SID!
// const authToken = process.env.TWILIO_AUTH_TOKEN!
// const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER!

// const twilioClient = new Twilio(accountSid, authToken)

// async function getFullOrderDetails(orderId: string): Promise<Order | null> {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${orderId}`,
//       {
//         method: "GET",
//         cache: "no-store",
//       }
//     )

//     if (!res.ok) throw new Error("Failed to fetch order details")

//     return await res.json()
//   } catch (error) {
//     console.error("Error fetching order details:", error)
//     return null
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData()
//     const from = formData.get("From") as string
//     const buttonPayload = formData.get("ButtonPayload") as string
//     const messageSid = formData.get("MessageSid") as string

//     if (!from || !buttonPayload) {
//       console.warn("Missing 'From' or 'ButtonPayload' in Twilio webhook.")
//       return NextResponse.json(
//         { success: false, message: "Missing required webhook fields." },
//         { status: 400 }
//       )
//     }

//     console.log("Twilio Button Click Received:", {
//       from,
//       buttonPayload,
//       messageSid,
//     })

//     const order = await getFullOrderDetails(buttonPayload)

//     if (!order) {
//       return NextResponse.json(
//         { success: false, error: `Order not found for ID: ${buttonPayload}` },
//         { status: 404 }
//       )
//     }

//     const messageTemplate = generateOrderConfirmationMessage(order)

//     const response = await twilioClient.messages.create({
//       from: `whatsapp:${whatsappNumber}`,
//       to: from,
//       body: messageTemplate,
//     })

//     return NextResponse.json({ success: true, messageSid: response.sid })
//   } catch (error: any) {
//     console.error("Webhook Error:", error)

//     let message = "Unexpected server error."

//     if (error?.message) message = error.message
//     if (error?.response?.data?.message) message = error.response.data.message
//     if (error?.moreInfo) {
//       message = `Twilio API Error: ${error.message} (Code: ${error.code}) - More info: ${error.moreInfo}`
//     }

//     return NextResponse.json(
//       { success: false, error: message },
//       { status: 500 }
//     )
//   }
// }

// export async function GET() {
//   return NextResponse.json({
//     message: "Twilio WhatsApp webhook endpoint is working.",
//     instructions:
//       "Send a POST request from Twilio to handle button interactions.",
//   })
// }

import { generateOrderConfirmationMessage } from "@/lib/actions/whatsAppMessages/generateOrderConfirmationMessage"
import { Order } from "@/types"
import { NextRequest, NextResponse } from "next/server"
import { Twilio } from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER!

const twilioClient = new Twilio(accountSid, authToken)

// Define the maximum number of products per WhatsApp message
// Based on your testing, 30 products seems to be a safe number to avoid the 1600 character limit.
const PRODUCTS_PER_MESSAGE = 30

// --- Helper Function to Fetch Order Details ---
async function getFullOrderDetails(orderId: string): Promise<Order | null> {
  try {
    // Ensure NEXT_PUBLIC_BASE_URL is correctly set in your .env file
    const res = await fetch(
      `http://localhost:3000/api/orders/${orderId}`, // Adjust path to your order API
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

    // Fetch the complete order details
    const order = await getFullOrderDetails(buttonPayload)

    if (!order) {
      console.error(`Order not found for ID: ${buttonPayload}`)
      // Optionally send a fallback message to the customer here
      // await twilioClient.messages.create({
      //   from: `whatsapp:${whatsappNumber}`,
      //   to: from,
      //   body: "Apologies, I couldn't find details for your order. Please contact support.",
      // });
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
        // body: "THANK YOU!!!",
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

    // Attempt to send an error message back to the customer if the initial fetch/setup worked
    // (Optional, uncomment if you want to notify the user of an internal error)
    // if (from && !res.headersSent) { // Check if headers haven't been sent yet
    //   try {
    //     await twilioClient.messages.create({
    //       from: `whatsapp:${whatsappNumber}`,
    //       to: from,
    //       body: "Apologies, there was an internal issue processing your request. Please try again later.",
    //     });
    //   } catch (twilioSendError) {
    //     console.error("Failed to send error message to user:", twilioSendError);
    //   }
    // }

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
