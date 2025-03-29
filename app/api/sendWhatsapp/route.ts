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
