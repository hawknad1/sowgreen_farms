// // in your endpoint that sends the template message
// import { auth } from "@/auth"
// import prisma from "@/lib/prismadb"
// import twilioClient from "@/lib/twilio/twilio"
// import { NextResponse } from "next/server"

// const contentSid = process.env.TWILIO_TEMPLATE_CONTENT_SID_CUSTOMER_NOTES!
// const whatsappNumber = process.env.TWILIO_WHATSAPP_SENDER!

// export async function POST(req: Request) {
//   try {
//     const session = await auth()
//     // Assuming you also pass the orderId when calling this endpoint
//     const { to, order } = await req.json()

// const orderNumber = order?.orderNumber
// const specialNotes = order?.specialNotes

//     // if (!session) {
//     //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     // }

//     // const user = await prisma.user.findUnique({
//     //   where: { email: session.user?.email! },
//     // })

//     // if (user?.role !== "admin") {
//     //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
//     // }

//     // if (!to || !name || !orderId) {
//     //   return NextResponse.json(
//     //     { error: "Missing 'to', 'name', or 'orderId'" },
//     //     { status: 400 }
//     //   )
//     // }

//     const message = await twilioClient.messages.create({
//       contentSid,
//       contentVariables: JSON.stringify({
// 1: orderNumber,
// 2: specialNotes,
//       }),
//       from: `whatsapp:${whatsappNumber}`,
//       to: `whatsapp:${to}`,
//     })

//     return NextResponse.json({
//       success: true,
//       sid: message.sid,
//     })
//   } catch (error: any) {
//     console.error("Twilio Error:", error)
//     return NextResponse.json(
//       { error: "Failed to send message", details: error.message },
//       { status: 500 }
//     )
//   }
// }

import twilioClient from "@/lib/twilio/twilio"
import { NextResponse, NextRequest } from "next/server"
import { truncate } from "@/lib/formatters"
import prisma from "@/lib/prismadb"
import { auth } from "@/auth"

interface Order {
  orderNumber: string
  specialNotes?: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized - You must log in!",
        },
        { status: 401 }
      )
    }

    // Check user role
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email },
    })

    if (user?.role !== "admin" && user?.role !== "supervisor") {
      return NextResponse.json(
        { error: "Forbidden - You don't have permission" },
        { status: 403 }
      )
    }

    // Read configuration from environment variables
    const targetConversationSid =
      process.env.NEXT_PUBLIC_TWILIO_CONVERSATIONS_SID_SOWGREEN_FARMS
    const templateSid = process.env.TWILIO_TEMPLATE_CONTENT_SID_CUSTOMER_NOTES

    if (!twilioClient) {
      return NextResponse.json(
        { success: false, error: "Twilio client not initialized" },
        { status: 500 }
      )
    }

    if (!targetConversationSid) {
      console.error(
        "ORDER_TARGET_CONVERSATION_SID environment variable is not set."
      )
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: Target conversation SID not set.",
        },
        { status: 500 }
      )
    }

    const order = (await request.json()) as Order

    if (!order || typeof order.orderNumber !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or incomplete Order payload in request body",
        },
        { status: 400 }
      )
    }

    // Prepare template variables
    const contentVariables = {
      "1": truncate(order.orderNumber, 60), // Order number
      "2": truncate(order.specialNotes || "No special notes provided", 60), // Special notes
    }

    // Create the template message
    const message = await twilioClient.conversations.v1
      .conversations(targetConversationSid)
      .messages.create({
        author: "system",
        contentSid: templateSid,
        contentVariables: JSON.stringify(contentVariables),
        // Fallback text that appears if template can't be rendered
        body: `Order Notification: ${order.orderNumber}\nSpecial Notes: ${order.specialNotes || "None"}`,
      })

    // Find the conversation in our DB
    const conversation = await prisma.conversation.findUnique({
      where: { twilioSid: targetConversationSid },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found in database" },
        { status: 404 }
      )
    }

    // Log the message in our database
    // await prisma.conversationMessage.create({
    //   data: {
    //     conversationId: conversation.id,
    //     twilioMessageSid: message.sid,
    //     body: message.body,
    //     author: message.author,
    //     metadata: {
    //       templateSid,
    //       contentVariables,
    //     },
    //   },
    // })

    await prisma.conversationMessage.create({
      data: {
        conversationId: conversation.id,
        twilioMessageSid: message.sid,
        body: JSON.stringify({
          // Using body to store structured data
          originalBody: message.body,
          templateData: {
            templateSid,
            contentVariables,
          },
        }),
        author: message.author,
      },
    })

    return NextResponse.json({
      success: true,
      messageSid: message.sid,
      conversationSid: targetConversationSid,
      templateSid,
      contentVariables,
      dateCreated: message.dateCreated,
    })
  } catch (error: unknown) {
    console.error("Error sending template message:", error)
    let errorMessage = "Failed to send template message."
    let statusCode = 500
    let errorDetails: any = null

    if (error instanceof Error) {
      errorMessage = error.message
      if (error.name === "SyntaxError") {
        errorMessage = "Invalid JSON payload in request body."
        statusCode = 400
      }
    } else if (typeof error === "object" && error !== null) {
      const twilioError = error as {
        code?: number
        message?: string
        status?: number
        more_info?: string
      }
      errorMessage = twilioError.message || errorMessage
      statusCode = twilioError.status || statusCode
      errorDetails = {
        code: twilioError.code,
        moreInfo: twilioError.more_info,
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
      },
      { status: statusCode }
    )
  }
}
