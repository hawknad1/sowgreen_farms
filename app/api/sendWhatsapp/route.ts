// /pages/api/sendWhatsappMessage.js

import { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"
import twilio from "twilio"

export async function POST(req: Request) {
  //   const message = req.json()
  const { message, customerNumber } = await req.json()

  // Twilio credentials
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN

  const client = twilio(accountSid, authToken)

  try {
    const response = await client.messages.create({
      body: message, // The message you want to send
      from: "whatsapp:+233553121737",
      to: `whatsapp:+233${customerNumber}`,
    })

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Couldnt send whatsapp message" },
      { status: 500 }
    )
  }
}
