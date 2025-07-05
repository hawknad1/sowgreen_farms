// import { auth } from "@/auth"
// import prisma from "@/lib/prismadb"
// import twilioClient from "@/lib/twilio/twilio"
// import { NextResponse } from "next/server"
// import twilio from "twilio"

// const contentSid = process.env.TWILIO_TEMPLATE_CONTENT_SID_NOTES!
// const whatsappNumber = process.env.TWILIO_WHATSAPP_SENDER!

// export async function POST(req: Request) {
//   try {
//     const session = await auth()
//     const { to, name } = await req.json()

//     if (!session) {
//       return NextResponse.json(
//         {
//           error: "Unauthorized - You must log in!",
//         },
//         { status: 401 }
//       )
//     }

//     // 2. Check user role (if you have admin/users distinction)
//     const user = await prisma.user.findUnique({
//       where: { email: session.user?.email },
//     })

//     if (user?.role !== "admin") {
//       // Add this if you want admin-only access
//       return NextResponse.json(
//         { error: "Forbidden - You don't have permission" },
//         { status: 403 }
//       )
//     }

//     if (!to || !name) {
//       return NextResponse.json(
//         { error: "Missing 'to' or 'name'" },
//         { status: 400 }
//       )
//     }

//     const message = await twilioClient.messages.create({
//       contentSid,
//       contentVariables: JSON.stringify({
//         1: "Customer",
//         2: "Sowgreen Farms",
//         3: "SW93UFH49",
//       }),
//       from: `whatsapp:${whatsappNumber}`,
//       to: `whatsapp:${to}`,
//     })

//     return NextResponse.json({
//       success: true,
//       sid: message.sid,
//       body: message.body,
//     })
//   } catch (error: any) {
//     console.error("Twilio Error:", error)
//     return NextResponse.json(
//       { error: "Failed to send message", details: error.message },
//       { status: 500 }
//     )
//   }
// }

// in your endpoint that sends the template message
import { auth } from "@/auth"
import prisma from "@/lib/prismadb"
import twilioClient from "@/lib/twilio/twilio"
import { NextResponse } from "next/server"

const contentSid = process.env.TWILIO_TEMPLATE_CONTENT_SID_NOTES!
const whatsappNumber = process.env.TWILIO_WHATSAPP_SENDER!

export async function POST(req: Request) {
  try {
    const session = await auth()
    // Assuming you also pass the orderId when calling this endpoint
    const { to, order } = await req.json()

    const orderId = order?.id
    const name = order?.shippingAddress?.name

    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // const user = await prisma.user.findUnique({
    //   where: { email: session.user?.email! },
    // })

    // if (user?.role !== "admin") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    // }

    // if (!to || !name || !orderId) {
    //   return NextResponse.json(
    //     { error: "Missing 'to', 'name', or 'orderId'" },
    //     { status: 400 }
    //   )
    // }

    const message = await twilioClient.messages.create({
      contentSid,
      contentVariables: JSON.stringify({
        1: name, // Example: Customer's name
        2: "Sowgreen Farms", // Example: Your company name
        3: order?.orderNumber, // Example: The note content
        // highlight-start
        // Set a unique payload for the reply button
        4: `reply_to_${orderId}`,
        // highlight-end
      }),
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${to}`,
    })

    return NextResponse.json({
      success: true,
      sid: message.sid,
    })
  } catch (error: any) {
    console.error("Twilio Error:", error)
    return NextResponse.json(
      { error: "Failed to send message", details: error.message },
      { status: 500 }
    )
  }
}
