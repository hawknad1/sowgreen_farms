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

// export async function POST(req: NextRequest) {
//   try {
//     const {
//       customerName,
//       deliveryDate,
//       customerPhone,
//       orderNumber,
//       deliveryMethod,
//       address,
//       deliveryFee,
//       total,
//       variables,
//     } = await req.json()

//     // Validate and format phone number (Ghana specific)
//     let formattedTo = customerPhone.trim()
//     if (!formattedTo.startsWith("+")) {
//       if (formattedTo.startsWith("0")) {
//         formattedTo = `+233${formattedTo.substring(1)}`
//       } else {
//         formattedTo = `+233${formattedTo}`
//       }
//     }

//     console.log(variables, "VAAARIABLESS")

//     // Extract products from variables
//     const products = variables["7"] || []

//     // Proceed with formatting the product list
//     const productList = products
//       .map((p: any, index: number) => {
//         try {
//           const item = p.item
//           if (!item?.product?.title) {
//             return `${index + 1}. Unknown Product - ${item.quantity}x`
//           }

//           const weightInfo =
//             item.weight && item.unit ? `${item.weight}${item.unit}` : ""

//           return `${index + 1}. ${item.product.title} - ${
//             item.quantity
//           }x ${weightInfo}`
//         } catch (error) {
//           console.error("Error formatting product:", error)
//           return `${index + 1}. Product information unavailable`
//         }
//       })
//       .join("\n")

//     // const productList = products
//     //   .map((p: any, index: number) => {
//     //     try {
//     //       // Check if product data exists
//     //       if (!p?.product?.title) {
//     //         return `${index + 1}. Unknown Product - ${p.quantity}x`
//     //       }

//     //       // Handle cases where weight or unit might be null
//     //       const weightInfo = p.weight && p.unit ? `${p.weight}${p.unit}` : ""

//     //       return `${index + 1}. ${p.product.title} - ${
//     //         p.quantity
//     //       }x ${weightInfo}`
//     //     } catch (error) {
//     //       console.error("Error formatting product:", error)
//     //       return `${index + 1}. Product information unavailable`
//     //     }
//     //   })
//     //   .join("\n")

//     const workersName = sowgreenWorkers.map((worker) => worker.name)
//     const workersNumber = sowgreenWorkers.map((worker) => worker.phone)
//     const workerOne = `${workersName[0]} - ${workersNumber[0]}`
//     const workerTwo = `${workersName[1]} - ${workersNumber[1]}`

//     // Send WhatsApp Message
//     const message = await client.messages.create({
//       from: `whatsapp:${whatsappNumber}`,
//       messagingServiceSid: messagingServiceSid,
//       to: `whatsapp:${formattedTo}`,
//       contentSid: contentSid, // Ensure this is an approved Twilio template
//       contentVariables: JSON.stringify(variables),
//     })
//     console.log(message, "message====")

//     return NextResponse.json({ success: true, messageSid: message.sid })
//   } catch (error) {
//     console.error("WhatsApp Template Message Error:", error)
//     return NextResponse.json(
//       { error: "Failed to send WhatsApp message", details: error },
//       { status: 500 }
//     )
//   }
// }

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { order } = body

    if (!order || !order.products || !order.shippingAddress) {
      return NextResponse.json(
        { error: "Missing order or shipping address" },
        { status: 400 }
      )
    }

    const address = order.shippingAddress

    // Build and flatten products array
    const formattedProductList = order.products
      .map((p: any, index: number) => {
        const title = p.product?.title || "Unnamed"
        const quantity = p.quantity
        const weight = p.weight ? `${p.weight}${p.unit || ""}` : ""
        return `${index + 1}. ${title} - ${quantity}x ${weight}`
      })
      .join("\n")

    // Build the correct content variables (everything must be a string)
    const variables = {
      "1": address.name || "",
      "2": order.orderNumber || "",
      "3": order.deliveryDate || "",
      "4": address.deliveryMethod?.trim() || "",
      "5": `${address.address}, ${address.city}`,
      "6": address.region || "",
      "7": formattedProductList || "",
      "8": String(order.deliveryFee ?? ""),
      "9": String(order.total ?? ""),
      "10": "Jenny", // or dynamic dispatch rider name
    }

    // Ensure the phone has country code
    const to = `whatsapp:${
      address.phone.startsWith("+")
        ? address.phone
        : `+233${address.phone.replace(/^0/, "")}`
    }`

    console.log(to, "to")
    console.log(variables, "variables")

    // Send WhatsApp message using Twilio Content API
    const response = await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to,
      contentSid,
      messagingServiceSid: "MG4709d74d340733d1c52bfdfb89c2e41a",

      contentVariables: JSON.stringify(variables),
    })

    return NextResponse.json({ success: true, sid: response.sid })
  } catch (error: any) {
    console.error("WhatsApp send error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

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

//     console.log(customerPhone, "customerPhone")

//     // Validate and format phone number (Ghana specific)
//     let formattedTo = customerPhone.trim()
//     if (!formattedTo.startsWith("+")) {
//       if (formattedTo.startsWith("0")) {
//         formattedTo = `+233${formattedTo.substring(1)}`
//       } else {
//         formattedTo = `+233${formattedTo}`
//       }
//     }

//     console.log(formattedTo, "formattedTo")

//     // Format product details into a readable string
//     // const productList = products
//     //   .map(
//     //     (p: any, index: number) =>
//     //       `${index + 1}. ${p.item.product.title} - ${p.item.quantity}x ${
//     //         p.item.weight
//     //       }${p.item.unit}`
//     //   )
//     //   .join("\n")
//     const productList = products
//     .map((p: any, index: number) => {
//       try {
//         // Check if product data exists
//         if (!p?.product?.title) {
//           return `${index + 1}. Unknown Product - ${p.quantity}x`
//         }

//         // Handle cases where weight or unit might be null
//         const weightInfo = p.weight && p.unit ? `${p.weight}${p.unit}` : ""

//         return `${index + 1}. ${p.product.title} - ${
//           p.quantity
//         }x ${weightInfo}`
//       } catch (error) {
//         console.error("Error formatting product:", error)
//         return `${index + 1}. Product information unavailable`
//       }
//     })
//     .join("\n")

//     const workersName = sowgreenWorkers.map((worker) => worker.name)
//     const workersNumber = sowgreenWorkers.map((worker) => worker.phone)
//     const workerOne = `${workersName[0]} - ${workersNumber[0]}`
//     const workerTwo = `${workersName[1]} - ${workersNumber[1]}`

//     // Send WhatsApp Message
//     const message = await client.messages.create({
//       from: `whatsapp:${whatsappNumber}`,
//       messagingServiceSid: messagingServiceSid,
//       to: `whatsapp:${formattedTo}`,
//       contentSid: contentSid, // Ensure this is an approved Twilio template
//       contentVariables: JSON.stringify({
//         "{{1}}": "customerName",
//         "{{2}}": "orderNumber",
//         "{{3}}": "deliveryDate",
//         "{{4}}": "deliveryMethod",
//         "{{5}}": "address",
//         "{{6}}": "workerOne",
//         "{{7}}": "productList",
//         "{{8}}": `${deliveryFee} GHS`,
//         "{{9}}": `${total} GHS`,
//         "{{10}}": "workerTwo",
//       }),
//     })

//     return NextResponse.json({ success: true, messageSid: message.sid })
//   } catch (error) {
//     console.error("WhatsApp Template Message Error:", error)
//     return NextResponse.json(
//       { error: "Failed to send WhatsApp message", details: error },
//       { status: 500 }
//     )
//   }
// }
