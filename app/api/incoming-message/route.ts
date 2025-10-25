// import { generateOrderConfirmationMessage } from "@/lib/actions/whatsAppMessages/generateOrderConfirmationMessage"
// import prisma from "@/lib/prismadb"
// import { Order } from "@/types"
// import { NextRequest, NextResponse } from "next/server"
// import { Twilio } from "twilio"

// const accountSid = process.env.TWILIO_ACCOUNT_SID!
// const authToken = process.env.TWILIO_AUTH_TOKEN!
// const whatsappNumber = process.env.TWILIO_WHATSAPP_SENDER
// const twilioClient = new Twilio(accountSid, authToken)
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// const PRODUCTS_PER_MESSAGE = 30

// // Validate MongoDB ObjectID
// const isValidObjectId = (id: string): boolean => {
//   return /^[0-9a-fA-F]{24}$/.test(id)
// }

// async function getFullOrderDetails(orderId: string): Promise<Order | null> {
//   try {
//     if (!isValidObjectId(orderId)) {
//       throw new Error("Invalid order ID format")
//     }

//     const res = await fetch(`${baseUrl}/api/orders/${orderId}`, {
//       method: "GET",
//       cache: "no-store",
//     })

//     if (!res.ok) {
//       const errorData = await res.text()
//       throw new Error(
//         `Failed to fetch order details: ${res.status} ${res.statusText} - ${errorData}`
//       )
//     }

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
//     const body = formData.get("Body") as string

//     console.log("Incoming webhook:", { from, buttonPayload, messageSid, body })

//     // Basic validation
//     if (!from) {
//       return NextResponse.json(
//         { success: false, error: "Missing 'From' in webhook data" },
//         { status: 400 }
//       )
//     }

//     // Extract and clean phone number
//     const phoneNumber = from.replace("whatsapp:+", "")

//     // Handle button clicks (view reply)
//     if (buttonPayload?.startsWith("reply_to_")) {
//       const orderId = buttonPayload.split("_")[2]

//       if (!isValidObjectId(orderId)) {
//         return NextResponse.json(
//           { success: false, error: "Invalid order ID format" },
//           { status: 400 }
//         )
//       }

//       // Update order and mark messages as read
//       const [order] = await Promise.all([
//         prisma.order.findUnique({
//           where: { id: orderId },
//           include: {
//             whatsappConversation: {
//               where: { sender: "admin" },
//               orderBy: { timestamp: "desc" },
//               take: 1,
//             },
//           },
//         }),
//         prisma.order.update({
//           where: { id: orderId },
//           data: {
//             customerLastMessagedAt: new Date(),
//             whatsappConversation: {
//               updateMany: {
//                 where: { sender: "admin", read: false },
//                 data: { read: true, readAt: new Date() },
//               },
//             },
//           },
//         }),
//       ])

//       if (!order) {
//         return NextResponse.json(
//           { success: false, error: "Order not found" },
//           { status: 404 }
//         )
//       }

//       // Send latest admin reply if exists
//       if (order.whatsappConversation.length > 0) {
//         const lastReply = order.whatsappConversation[0]
//         await twilioClient.messages.create({
//           from: `whatsapp:${whatsappNumber}`,
//           to: from,
//           body: `Regarding order #${order.orderNumber}:\n\n${lastReply.content}`,
//         })
//       }

//       return NextResponse.json({ success: true })
//     }

//     // Handle order confirmation requests
//     else if (buttonPayload && isValidObjectId(buttonPayload)) {
//       const order = await getFullOrderDetails(buttonPayload)

//       if (!order) {
//         return NextResponse.json(
//           { success: false, error: "Order not found" },
//           { status: 404 }
//         )
//       }

//       // Send order confirmation in batches
//       const totalProducts = order.products.length
//       let sentMessageSids: string[] = []

//       for (let i = 0; i < totalProducts; i += PRODUCTS_PER_MESSAGE) {
//         const startIndex = i
//         const endIndex = Math.min(i + PRODUCTS_PER_MESSAGE, totalProducts)

//         const message = generateOrderConfirmationMessage(
//           order,
//           startIndex,
//           endIndex
//         )
//         const response = await twilioClient.messages.create({
//           from: `whatsapp:${whatsappNumber}`,
//           to: from,
//           body: message,
//         })

//         sentMessageSids.push(response.sid)
//         if (endIndex < totalProducts)
//           await new Promise((resolve) => setTimeout(resolve, 1000))
//       }

//       return NextResponse.json({ success: true, messageSids: sentMessageSids })
//     }
//     // Handle direct customer messages
//     else if (body) {
//       // Find most recent order for this phone number
//       // const order = await prisma.order.findFirst({
//       //   where: {
//       //     shippingAddress: {
//       //       phone: {
//       //         contains: phoneNumber.slice(-9), // Match last 9 digits
//       //       },
//       //     },
//       //   },
//       //   orderBy: { createdAt: "desc" },
//       // })

//       // if (order) {
//       //   await Promise.all([
//       //     prisma.order.update({
//       //       where: { id: order.id },
//       //       data: { customerLastMessagedAt: new Date() },
//       //     }),
//       //     prisma.whatsappMessage.create({
//       //       data: {
//       //         content: body,
//       //         sender: "customer",
//       //         orderId: order.id,
//       //       },
//       //     }),
//       //     twilioClient.messages.create({
//       //       from: `whatsapp:${whatsappNumber}`,
//       //       to: from,
//       //       // body: "Thanks for your message! Our team will respond shortly.",
//       //     }),
//       //   ])
//       // } else {
//       //   await twilioClient.messages.create({
//       //     from: `whatsapp:${whatsappNumber}`,
//       //     to: from,
//       //     body: "Thanks for your message. Please provide your order number for assistance.",
//       //   })
//       // }
//       const order = await prisma.order.findFirst({
//         where: {
//           shippingAddress: {
//             phone: {
//               contains: phoneNumber.slice(-9), // Match last 9 digits
//             },
//           },
//         },
//         orderBy: { createdAt: "desc" },
//         include: {
//           whatsappConversation: {
//             where: {
//               content: body,
//               sender: "customer",
//             },
//             take: 1,
//           },
//         },
//       })

//       if (order) {
//         // Only save if this exact message doesn't already exist
//         if (order.whatsappConversation.length === 0) {
//           await Promise.all([
//             prisma.order.update({
//               where: { id: order.id },
//               data: {
//                 customerLastMessagedAt: new Date(),
//                 // Only set specialNotes if it's empty
//                 ...(!order.specialNotes && { specialNotes: body }),
//               },
//             }),
//             prisma.whatsappMessage.create({
//               data: {
//                 content: body,
//                 sender: "customer",
//                 orderId: order.id,
//               },
//             }),
//           ])
//         } else {
//           // Just update the timestamp if message exists
//           await prisma.order.update({
//             where: { id: order.id },
//             data: { customerLastMessagedAt: new Date() },
//           })
//         }

//         await twilioClient.messages.create({
//           from: `whatsapp:${whatsappNumber}`,
//           to: from,
//           // body: "Thanks for your message! Our team will respond shortly.",
//           body: "",
//         })
//       }

//       return NextResponse.json({ success: true })
//     }

//     return NextResponse.json(
//       { success: false, error: "Unhandled webhook event" },
//       { status: 400 }
//     )
//   } catch (error: any) {
//     console.error("Webhook Error:", error)

//     let errorMessage = "An unexpected server error occurred"
//     if (error?.message) errorMessage = error.message
//     if (error?.code === "P2023") errorMessage = "Invalid database ID format"

//     return NextResponse.json(
//       {
//         success: false,
//         error: errorMessage,
//         ...(error?.code && { code: error.code }),
//       },
//       { status: 500 }
//     )
//   }
// }

// export async function GET() {
//   return NextResponse.json({
//     status: "operational",
//     message: "WhatsApp webhook endpoint is ready",
//     instructions: "Send POST requests from Twilio to handle messages",
//   })
// }

// // import { generateOrderConfirmationMessage } from "@/lib/actions/whatsAppMessages/generateOrderConfirmationMessage"
// // import prisma from "@/lib/prismadb"
// // import { Order } from "@/types"
// // import { NextRequest, NextResponse } from "next/server"
// // import { Twilio } from "twilio"

// // const accountSid = process.env.TWILIO_ACCOUNT_SID!
// // const authToken = process.env.TWILIO_AUTH_TOKEN!
// // const whatsappNumber = process.env.TWILIO_WHATSAPP_SENDER
// // const twilioClient = new Twilio(accountSid, authToken)
// // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// // const PRODUCTS_PER_MESSAGE = 30

// // // Validate MongoDB ObjectID
// // const isValidObjectId = (id: string): boolean => {
// //   return /^[0-9a-fA-F]{24}$/.test(id)
// // }

// // async function getFullOrderDetails(orderId: string): Promise<Order | null> {
// //   try {
// //     if (!isValidObjectId(orderId)) {
// //       throw new Error("Invalid order ID format")
// //     }

// //     const res = await fetch(`${baseUrl}/api/orders/${orderId}`, {
// //       method: "GET",
// //       cache: "no-store",
// //     })

// //     if (!res.ok) {
// //       const errorData = await res.text()
// //       throw new Error(
// //         `Failed to fetch order details: ${res.status} ${res.statusText} - ${errorData}`
// //       )
// //     }

// //     return await res.json()
// //   } catch (error) {
// //     console.error("Error fetching order details:", error)
// //     return null
// //   }
// // }

// // export async function POST(req: NextRequest) {
// //   try {
// //     const formData = await req.formData()
// //     const from = formData.get("From") as string
// //     const buttonPayload = formData.get("ButtonPayload") as string
// //     const messageSid = formData.get("MessageSid") as string
// //     const body = formData.get("Body") as string

// //     console.log("Incoming webhook:", { from, buttonPayload, messageSid, body })

// //     // Basic validation
// //     if (!from) {
// //       return NextResponse.json(
// //         { success: false, error: "Missing 'From' in webhook data" },
// //         { status: 400 }
// //       )
// //     }

// //     // Extract and clean phone number
// //     const phoneNumber = from.replace("whatsapp:+", "")

// //     // Handle button clicks (view reply)
// //     if (buttonPayload?.startsWith("reply_to_")) {
// //       const orderId = buttonPayload.split("_")[2]

// //       if (!isValidObjectId(orderId)) {
// //         return NextResponse.json(
// //           { success: false, error: "Invalid order ID format" },
// //           { status: 400 }
// //         )
// //       }

// //       // Update order and mark messages as read
// //       const [order] = await Promise.all([
// //         prisma.order.findUnique({
// //           where: { id: orderId },
// //           include: {
// //             whatsappConversation: {
// //               where: { sender: "admin" },
// //               orderBy: { timestamp: "desc" },
// //               take: 1,
// //             },
// //           },
// //         }),
// //         prisma.order.update({
// //           where: { id: orderId },
// //           data: {
// //             customerLastMessagedAt: new Date(),
// //             whatsappConversation: {
// //               updateMany: {
// //                 where: { sender: "admin", read: false },
// //                 data: { read: true, readAt: new Date() },
// //               },
// //             },
// //           },
// //         }),
// //       ])

// //       if (!order) {
// //         return NextResponse.json(
// //           { success: false, error: "Order not found" },
// //           { status: 404 }
// //         )
// //       }

// //       // Send latest admin reply if exists
// //       if (order.whatsappConversation.length > 0) {
// //         const lastReply = order.whatsappConversation[0]
// //         await twilioClient.messages.create({
// //           from: `whatsapp:${whatsappNumber}`,
// //           to: from,
// //           body: `Regarding order #${order.orderNumber}:\n\n${lastReply.content}`,
// //         })
// //       }

// //       return NextResponse.json({ success: true })
// //     }

// //     // Handle order confirmation requests
// //     else if (buttonPayload && isValidObjectId(buttonPayload)) {
// //       const order = await getFullOrderDetails(buttonPayload)

// //       if (!order) {
// //         return NextResponse.json(
// //           { success: false, error: "Order not found" },
// //           { status: 404 }
// //         )
// //       }

// //       // Send order confirmation in batches
// //       const totalProducts = order.products.length
// //       let sentMessageSids: string[] = []

// //       for (let i = 0; i < totalProducts; i += PRODUCTS_PER_MESSAGE) {
// //         const startIndex = i
// //         const endIndex = Math.min(i + PRODUCTS_PER_MESSAGE, totalProducts)

// //         const message = generateOrderConfirmationMessage(
// //           order,
// //           startIndex,
// //           endIndex
// //         )
// //         const response = await twilioClient.messages.create({
// //           from: `whatsapp:${whatsappNumber}`,
// //           to: from,
// //           body: message,
// //         })

// //         sentMessageSids.push(response.sid)
// //         if (endIndex < totalProducts)
// //           await new Promise((resolve) => setTimeout(resolve, 1000))
// //       }

// //       return NextResponse.json({ success: true, messageSids: sentMessageSids })
// //     }

// //     return NextResponse.json(
// //       { success: false, error: "Unhandled webhook event" },
// //       { status: 400 }
// //     )
// //   } catch (error: any) {
// //     console.error("Webhook Error:", error)

// //     let errorMessage = "An unexpected server error occurred"
// //     if (error?.message) errorMessage = error.message
// //     if (error?.code === "P2023") errorMessage = "Invalid database ID format"

// //     return NextResponse.json(
// //       {
// //         success: false,
// //         error: errorMessage,
// //         ...(error?.code && { code: error.code }),
// //       },
// //       { status: 500 }
// //     )
// //   }
// // }

// // export async function GET() {
// //   return NextResponse.json({
// //     status: "operational",
// //     message: "WhatsApp webhook endpoint is ready",
// //     instructions: "Send POST requests from Twilio to handle messages",
// //   })
// // }

import {
  calculateBrandAwareBatches,
  generateOrderConfirmationMessage,
} from "@/lib/actions/whatsAppMessages/generateOrderConfirmationMessage"
import prisma from "@/lib/prismadb"
import { Order } from "@/types"
import { NextRequest, NextResponse } from "next/server"
import { Twilio } from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const whatsappNumber = process.env.TWILIO_WHATSAPP_SENDER
const twilioClient = new Twilio(accountSid, authToken)

const PRODUCTS_PER_MESSAGE = 30

// Validate MongoDB ObjectID
const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

// Fetch order details directly from the database instead of making HTTP request
async function getFullOrderDetails(orderId: string): Promise<Order | null> {
  try {
    if (!isValidObjectId(orderId)) {
      throw new Error("Invalid order ID format")
    }

    // Query the database directly instead of using fetch
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        products: {
          include: {
            product: {
              include: {
                partner: true,
              },
            },
          },
        },
        shippingAddress: true,
        user: true,
        whatsappConversation: true,
      },
    })

    // Cast to Order type (adjust includes based on your Order type definition)
    return order as unknown as Order | null
  } catch (error) {
    console.error("Error fetching order details:", error)
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const from = formData.get("From") as string
    const buttonPayload = formData.get("ButtonPayload") as string
    const messageSid = formData.get("MessageSid") as string
    const body = formData.get("Body") as string

    console.log("Incoming webhook:", { from, buttonPayload, messageSid, body })

    // Basic validation
    if (!from) {
      return NextResponse.json(
        { success: false, error: "Missing 'From' in webhook data" },
        { status: 400 }
      )
    }

    // Extract and clean phone number
    const phoneNumber = from.replace("whatsapp:+", "")

    // Handle button clicks (view reply)
    if (buttonPayload?.startsWith("reply_to_")) {
      const orderId = buttonPayload.split("_")[2]

      if (!isValidObjectId(orderId)) {
        return NextResponse.json(
          { success: false, error: "Invalid order ID format" },
          { status: 400 }
        )
      }

      // Update order and mark messages as read
      const [order] = await Promise.all([
        prisma.order.findUnique({
          where: { id: orderId },
          include: {
            whatsappConversation: {
              where: { sender: "admin" },
              orderBy: { timestamp: "desc" },
              take: 1,
            },
          },
        }),
        prisma.order.update({
          where: { id: orderId },
          data: {
            customerLastMessagedAt: new Date(),
            whatsappConversation: {
              updateMany: {
                where: { sender: "admin", read: false },
                data: { read: true, readAt: new Date() },
              },
            },
          },
        }),
      ])

      if (!order) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        )
      }

      // Send latest admin reply if exists
      if (order.whatsappConversation.length > 0) {
        const lastReply = order.whatsappConversation[0]
        await twilioClient.messages.create({
          from: `whatsapp:${whatsappNumber}`,
          to: from,
          body: `Regarding order #${order.orderNumber}:\n\n${lastReply.content}`,
        })
      }

      return NextResponse.json({ success: true })
    }

    // Handle order confirmation requests (View Ordered Items button)
    else if (buttonPayload && isValidObjectId(buttonPayload)) {
      console.log(`Fetching order details for ID: ${buttonPayload}`)

      const order = await getFullOrderDetails(buttonPayload)

      if (!order) {
        console.error(`Order not found for ID: ${buttonPayload}`)
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        )
      }

      console.log(
        `Order found: #${order.orderNumber}, Products: ${order.products?.length || 0}`
      )

      // Validate that products exist
      if (!order.products || order.products.length === 0) {
        await twilioClient.messages.create({
          from: `whatsapp:${whatsappNumber}`,
          to: from,
          body: `Order #${order.orderNumber} has no products.`,
        })
        return NextResponse.json({
          success: true,
          message: "Order has no products",
        })
      }

      // Send order confirmation in batches
      // const totalProducts = order.products.length
      // let sentMessageSids: string[] = []

      // for (let i = 0; i < totalProducts; i += PRODUCTS_PER_MESSAGE) {
      //   const startIndex = i
      //   const endIndex = Math.min(i + PRODUCTS_PER_MESSAGE, totalProducts)

      //   const message = generateOrderConfirmationMessage(
      //     order,
      //     startIndex,
      //     endIndex
      //   )

      //   console.log(
      //     `Sending message batch ${Math.floor(i / PRODUCTS_PER_MESSAGE) + 1}`
      //   )

      //   const response = await twilioClient.messages.create({
      //     from: `whatsapp:${whatsappNumber}`,
      //     to: from,
      //     body: message,
      //   })

      //   sentMessageSids.push(response.sid)

      //   // Add delay between messages if there are more to send
      //   if (endIndex < totalProducts) {
      //     await new Promise((resolve) => setTimeout(resolve, 1000))
      //   }
      const batches = calculateBrandAwareBatches(order, PRODUCTS_PER_MESSAGE)
      let sentMessageSids: string[] = []

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const { startIndex, endIndex } = batches[batchIndex]

        const message = generateOrderConfirmationMessage(
          order,
          startIndex,
          endIndex
        )

        console.log(
          `Sending brand-aware batch ${batchIndex + 1} of ${batches.length} (items ${startIndex + 1}-${endIndex})`
        )

        const response = await twilioClient.messages.create({
          from: `whatsapp:${whatsappNumber}`,
          to: from,
          body: message,
        })

        sentMessageSids.push(response.sid)

        // Add delay between messages if there are more to send
        if (batchIndex < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      console.log(`Successfully sent ${sentMessageSids.length} messages`)
      return NextResponse.json({ success: true, messageSids: sentMessageSids })
    }

    // Handle direct customer messages
    else if (body) {
      const order = await prisma.order.findFirst({
        where: {
          shippingAddress: {
            phone: {
              contains: phoneNumber.slice(-9), // Match last 9 digits
            },
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          whatsappConversation: {
            where: {
              content: body,
              sender: "customer",
            },
            take: 1,
          },
        },
      })

      if (order) {
        // Only save if this exact message doesn't already exist
        if (order.whatsappConversation.length === 0) {
          await Promise.all([
            prisma.order.update({
              where: { id: order.id },
              data: {
                customerLastMessagedAt: new Date(),
                // Only set specialNotes if it's empty
                ...(!order.specialNotes && { specialNotes: body }),
              },
            }),
            prisma.whatsappMessage.create({
              data: {
                content: body,
                sender: "customer",
                orderId: order.id,
              },
            }),
          ])
        } else {
          // Just update the timestamp if message exists
          await prisma.order.update({
            where: { id: order.id },
            data: { customerLastMessagedAt: new Date() },
          })
        }
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: "Unhandled webhook event" },
      { status: 400 }
    )
  } catch (error: any) {
    console.error("Webhook Error:", error)

    let errorMessage = "An unexpected server error occurred"
    if (error?.message) errorMessage = error.message
    if (error?.code === "P2023") errorMessage = "Invalid database ID format"

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        ...(error?.code && { code: error.code }),
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: "operational",
    message: "WhatsApp webhook endpoint is ready",
    instructions: "Send POST requests from Twilio to handle messages",
  })
}

// import { generateOrderConfirmationMessage } from "@/lib/actions/whatsAppMessages/generateOrderConfirmationMessage"
// import prisma from "@/lib/prismadb"
// import { Order } from "@/types"
// import { NextRequest, NextResponse } from "next/server"
// import { Twilio } from "twilio"

// const accountSid = process.env.TWILIO_ACCOUNT_SID!
// const authToken = process.env.TWILIO_AUTH_TOKEN!
// const whatsappNumber = process.env.TWILIO_WHATSAPP_SENDER
// const twilioClient = new Twilio(accountSid, authToken)
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// const PRODUCTS_PER_MESSAGE = 30

// // Validate MongoDB ObjectID
// const isValidObjectId = (id: string): boolean => {
//   return /^[0-9a-fA-F]{24}$/.test(id)
// }

// async function getFullOrderDetails(orderId: string): Promise<Order | null> {
//   try {
//     if (!isValidObjectId(orderId)) {
//       throw new Error("Invalid order ID format")
//     }

//     const res = await fetch(`${baseUrl}/api/orders/${orderId}`, {
//       method: "GET",
//       cache: "no-store",
//     })

//     if (!res.ok) {
//       const errorData = await res.text()
//       throw new Error(
//         `Failed to fetch order details: ${res.status} ${res.statusText} - ${errorData}`
//       )
//     }

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
//     const body = formData.get("Body") as string

//     console.log("Incoming webhook:", { from, buttonPayload, messageSid, body })

//     // Basic validation
//     if (!from) {
//       return NextResponse.json(
//         { success: false, error: "Missing 'From' in webhook data" },
//         { status: 400 }
//       )
//     }

//     // Extract and clean phone number
//     const phoneNumber = from.replace("whatsapp:+", "")

//     // Handle button clicks (view reply)
//     if (buttonPayload?.startsWith("reply_to_")) {
//       const orderId = buttonPayload.split("_")[2]

//       if (!isValidObjectId(orderId)) {
//         return NextResponse.json(
//           { success: false, error: "Invalid order ID format" },
//           { status: 400 }
//         )
//       }

//       // Update order and mark messages as read
//       const [order] = await Promise.all([
//         prisma.order.findUnique({
//           where: { id: orderId },
//           include: {
//             whatsappConversation: {
//               where: { sender: "admin" },
//               orderBy: { timestamp: "desc" },
//               take: 1,
//             },
//           },
//         }),
//         prisma.order.update({
//           where: { id: orderId },
//           data: {
//             customerLastMessagedAt: new Date(),
//             whatsappConversation: {
//               updateMany: {
//                 where: { sender: "admin", read: false },
//                 data: { read: true, readAt: new Date() },
//               },
//             },
//           },
//         }),
//       ])

//       if (!order) {
//         return NextResponse.json(
//           { success: false, error: "Order not found" },
//           { status: 404 }
//         )
//       }

//       // Send latest admin reply if exists
//       if (order.whatsappConversation.length > 0) {
//         const lastReply = order.whatsappConversation[0]
//         await twilioClient.messages.create({
//           from: `whatsapp:${whatsappNumber}`,
//           to: from,
//           body: `Regarding order #${order.orderNumber}:\n\n${lastReply.content}`,
//         })
//       }

//       return NextResponse.json({ success: true })
//     }

//     // Handle order confirmation requests
//     else if (buttonPayload && isValidObjectId(buttonPayload)) {
//       const order = await getFullOrderDetails(buttonPayload)

//       if (!order) {
//         return NextResponse.json(
//           { success: false, error: "Order not found" },
//           { status: 404 }
//         )
//       }

//       // Send order confirmation in batches
//       const totalProducts = order.products.length
//       let sentMessageSids: string[] = []

//       for (let i = 0; i < totalProducts; i += PRODUCTS_PER_MESSAGE) {
//         const startIndex = i
//         const endIndex = Math.min(i + PRODUCTS_PER_MESSAGE, totalProducts)

//         const message = generateOrderConfirmationMessage(
//           order,
//           startIndex,
//           endIndex
//         )
//         const response = await twilioClient.messages.create({
//           from: `whatsapp:${whatsappNumber}`,
//           to: from,
//           body: message,
//         })

//         sentMessageSids.push(response.sid)
//         if (endIndex < totalProducts)
//           await new Promise((resolve) => setTimeout(resolve, 1000))
//       }

//       return NextResponse.json({ success: true, messageSids: sentMessageSids })
//     }
//     // Handle direct customer messages
//     else if (body) {
//       const order = await prisma.order.findFirst({
//         where: {
//           shippingAddress: {
//             phone: {
//               contains: phoneNumber.slice(-9), // Match last 9 digits
//             },
//           },
//         },
//         orderBy: { createdAt: "desc" },
//         include: {
//           whatsappConversation: {
//             where: {
//               content: body,
//               sender: "customer",
//             },
//             take: 1,
//           },
//         },
//       })

//       if (order) {
//         // Only save if this exact message doesn't already exist
//         if (order.whatsappConversation.length === 0) {
//           await Promise.all([
//             prisma.order.update({
//               where: { id: order.id },
//               data: {
//                 customerLastMessagedAt: new Date(),
//                 // Only set specialNotes if it's empty
//                 ...(!order.specialNotes && { specialNotes: body }),
//               },
//             }),
//             prisma.whatsappMessage.create({
//               data: {
//                 content: body,
//                 sender: "customer",
//                 orderId: order.id,
//               },
//             }),
//           ])
//         } else {
//           // Just update the timestamp if message exists
//           await prisma.order.update({
//             where: { id: order.id },
//             data: { customerLastMessagedAt: new Date() },
//           })
//         }

//         // await twilioClient.messages.create({
//         //   from: `whatsapp:${whatsappNumber}`,
//         //   to: from,
//         //   // body: "Thanks for your message! Our team will respond shortly.",
//         //   body: "",
//         // })
//       }

//       return NextResponse.json({ success: true })
//     }

//     return NextResponse.json(
//       { success: false, error: "Unhandled webhook event" },
//       { status: 400 }
//     )
//   } catch (error: any) {
//     console.error("Webhook Error:", error)

//     let errorMessage = "An unexpected server error occurred"
//     if (error?.message) errorMessage = error.message
//     if (error?.code === "P2023") errorMessage = "Invalid database ID format"

//     return NextResponse.json(
//       {
//         success: false,
//         error: errorMessage,
//         ...(error?.code && { code: error.code }),
//       },
//       { status: 500 }
//     )
//   }
// }

// export async function GET() {
//   return NextResponse.json({
//     status: "operational",
//     message: "WhatsApp webhook endpoint is ready",
//     instructions: "Send POST requests from Twilio to handle messages",
//   })
// }
