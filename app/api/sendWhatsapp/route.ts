// import { NextResponse } from "next/server"
// import twilio from "twilio"

// export async function POST(req: Request) {
//   // Parse the request body
//   const { message, customerNumber } = await req.json()

//   // Validate input
//   if (!message || !customerNumber) {
//     return NextResponse.json(
//       { message: "Message and customerNumber are required" },
//       { status: 400 }
//     )
//   }

//   // Validate Twilio credentials
//   const accountSid = process.env.TWILIO_ACCOUNT_SID
//   const authToken = process.env.TWILIO_AUTH_TOKEN

//   if (!accountSid || !authToken) {
//     return NextResponse.json(
//       { message: "Twilio credentials are missing" },
//       { status: 500 }
//     )
//   }

//   // Initialize Twilio client
//   const client = twilio(accountSid, authToken)

//   try {
//     // Send the WhatsApp message
//     const response = await client.messages.create({
//       body: message,
//       from: "whatsapp:+233553121737", // Your Twilio WhatsApp number
//       to: `whatsapp:+233${customerNumber}`, // Dynamic recipient number
//     })

//     // Return success response
//     return NextResponse.json(
//       {
//         message: "WhatsApp message sent successfully",
//         sid: response.sid,
//       },
//       { status: 200 }
//     )
//   } catch (error) {
//     // Log the error for debugging
//     console.error("Error sending WhatsApp message:", error)

//     // Return error response
//     return NextResponse.json(
//       {
//         message: "Failed to send WhatsApp message",
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     )
//   }
// }

import { sowgreenWorkers } from "@/constants"
import { NextRequest, NextResponse } from "next/server"
import twilio from "twilio"

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER! // Twilio WhatsApp Sender Number
const contentSid = process.env.TWILIO_CONTENT_SID!
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID!

const client = twilio(accountSid, authToken)

export async function POST(req: NextRequest) {
  try {
    const {
      customerName,
      deliveryDate,
      customerPhone,
      orderNumber,
      deliveryMethod,
      address,
      products,
      deliveryFee,
      total,
    } = await req.json()

    // Validate and format phone number (Ghana specific)
    let formattedTo = customerPhone.trim()
    if (!formattedTo.startsWith("+")) {
      if (formattedTo.startsWith("0")) {
        formattedTo = `+233${formattedTo.substring(1)}`
      } else {
        formattedTo = `+233${formattedTo}`
      }
    }

    // Format product details into a readable string
    const productList = products
      .map(
        (p: any, index: number) =>
          `${index + 1}. ${p.item.product.title} - ${p.item.quantity}x ${
            p.item.weight
          }${p.item.unit}`
      )
      .join("\n")

    const workersName = sowgreenWorkers.map((worker) => worker.name)
    const workersNumber = sowgreenWorkers.map((worker) => worker.phone)
    const workerOne = `${workersName[0]} - ${workersNumber[0]}`
    const workerTwo = `${workersName[1]} - ${workersNumber[1]}`

    // Send WhatsApp Message
    const message = await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      messagingServiceSid: messagingServiceSid,
      to: `whatsapp:${formattedTo}`,
      contentSid: contentSid, // Ensure this is an approved Twilio template
      // contentVariables: JSON.stringify({
      //   1: customerName,
      //   2: orderNumber,
      //   3: deliveryDate,
      //   4: deliveryMethod,
      //   5: address,
      //   6: workerOne,
      //   7: productList, // Pass formatted product details
      //   8: deliveryFee,
      //   9: total,
      //   10: workerTwo,
      // }),
      contentVariables: JSON.stringify({
        "{{1}}": customerName,
        "{{2}}": orderNumber,
        "{{3}}": deliveryDate,
        "{{4}}": deliveryMethod,
        "{{5}}": address,
        "{{6}}": workerOne,
        "{{7}}": productList,
        "{{8}}": `${deliveryFee} GHS`,
        "{{9}}": `${total} GHS`,
        "{{10}}": workerTwo,
      }),
    })

    return NextResponse.json({ success: true, messageSid: message.sid })
  } catch (error) {
    console.error("WhatsApp Template Message Error:", error)
    return NextResponse.json(
      { error: "Failed to send WhatsApp message", details: error },
      { status: 500 }
    )
  }
}

// import { sowgreenWorkers } from "@/constants"
// import { NextRequest, NextResponse } from "next/server"
// import twilio from "twilio"

// // Load environment variables
// const accountSid = process.env.TWILIO_ACCOUNT_SID!
// const authToken = process.env.TWILIO_AUTH_TOKEN!
// const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER! // Twilio WhatsApp Sender Number
// const contentSid = process.env.TWILIO_CONTENT_SID!
// const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID!

// const client = twilio(accountSid, authToken)

// export async function POST(req: NextRequest) {
//   try {
//     const {
//       customerName,
//       deliveryDate,
//       customerPhone,
//       orderNumber,
//       deliveryMethod,
//       address,
//       products,
//       deliveryFee,
//       total,
//     } = await req.json()

//     const workersName = sowgreenWorkers.map((worker) => worker.name)
//     const workersNumber = sowgreenWorkers.map((worker) => worker.phone)

//     const workerOne = `${workersName[0]} - ${workersNumber[0]}`
//     const workerTwo = `${workersName[1]} - ${workersNumber[1]}`

//     // 2. Validate and format number (Ghana specific)
//     const formattedTo = customerPhone.startsWith("+233")
//       ? customerPhone
//       : customerPhone.startsWith("0")
//       ? `+233${customerPhone.substring(1)}`
//       : `+233${customerPhone}`

//     if (!customerPhone.startsWith("+")) {
//       return NextResponse.json(
//         { error: "Invalid phone number format" },
//         { status: 400 }
//       )
//     }

//     const message = await client.messages.create({
//       from: `whatsapp:${whatsappNumber}`,
//       messagingServiceSid: messagingServiceSid,
//       to: `whatsapp:${formattedTo}`,
//       contentSid: contentSid, // Replace with your actual Twilio-approved template SID
//       contentVariables: JSON.stringify({
//         1: customerName,
//         2: orderNumber,
//         3: deliveryDate,
//         4: deliveryMethod,
//         5: address,
//         6: workerOne,
//         7: products,
//         8: deliveryFee,
//         9: total,
//         10: workerTwo,
//       }),
//     })

//     return NextResponse.json({ success: true, messageSid: message.sid })
//   } catch (error) {
//     console.error("WhatsApp Template Message Error:", error)
//     return NextResponse.json(
//       { error: "Failed to send WhatsApp message" },
//       { status: 500 }
//     )
//   }
// }
