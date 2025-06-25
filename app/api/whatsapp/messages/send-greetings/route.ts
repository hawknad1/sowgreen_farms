// app/api/send-whatsapp-message/route.ts

import { auth } from "@/auth"
import prisma from "@/lib/prismadb"
import twilioClient from "@/lib/twilio/twilio"
import { NextResponse } from "next/server"
import twilio from "twilio"

// const accountSid = process.env.TWILIO_ACCOUNT_SID!
// const authToken = process.env.TWILIO_AUTH_TOKEN!
// const client = twilio(accountSid, authToken)

const contentSid = process.env.TWILIO_SOWGREEN_GREETINGS_TEMPLATE_SID
const whatsappNumber = process.env.TWILIO_WHATSAPP_SENDER!

export async function POST(req: Request) {
  try {
    const session = await auth()
    const { to, name } = await req.json()

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized - You must log in!",
        },
        { status: 401 }
      )
    }

    // 2. Check user role (if you have admin/users distinction)
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email },
    })

    if (user?.role !== "admin") {
      // Add this if you want admin-only access
      return NextResponse.json(
        { error: "Forbidden - You don't have permission" },
        { status: 403 }
      )
    }

    if (!to || !name) {
      return NextResponse.json(
        { error: "Missing 'to' or 'name'" },
        { status: 400 }
      )
    }

    const message = await twilioClient.messages.create({
      contentSid,
      contentVariables: JSON.stringify({ 1: name }),
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${to}`,
    })

    return NextResponse.json({
      success: true,
      sid: message.sid,
      body: message.body,
    })
  } catch (error: any) {
    console.error("Twilio Error:", error)
    return NextResponse.json(
      { error: "Failed to send message", details: error.message },
      { status: 500 }
    )
  }
}
