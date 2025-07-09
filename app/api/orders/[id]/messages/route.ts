// app/api/orders/[orderId]/messages/route.ts
import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

// export async function GET(
//   req: Request,
//   { params }: { params: { orderId: string } }
// ) {
//   try {
//     const messages = await prisma.whatsappMessage.findMany({
//       where: { orderId: params.orderId },
//       orderBy: { timestamp: "asc" },
//     })

//     return NextResponse.json({ messages })
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch messages" },
//       { status: 500 }
//     )
//   }
// }

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get both special notes and whatsapp messages
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      select: {
        specialNotes: true,
        createdAt: true,
        whatsappConversation: {
          orderBy: { timestamp: "asc" },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Combine special notes with whatsapp messages
    const messages = []

    if (order.specialNotes) {
      messages.push({
        content: order.specialNotes,
        timestamp: order.createdAt,
        sender: "customer",
        read: true,
      })
    }

    messages.push(
      ...order.whatsappConversation.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
        readAt: msg.readAt?.toISOString(),
      }))
    )

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

// export async function POST(
//   req: Request,
//   { params }: { params: { orderId: string } }
// ) {
//   try {
//     const { content, sender } = await req.json()

//     const message = await prisma.whatsappMessage.create({
//       data: {
//         content,
//         sender,
//         orderId: params.orderId,
//       },
//     })

//     return NextResponse.json(message)
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to create message" },
//       { status: 500 }
//     )
//   }
// }

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate order ID
    if (!params.id || params.id.length !== 24) {
      return NextResponse.json(
        { error: "Invalid order ID format" },
        { status: 400 }
      )
    }

    const { content, sender } = await req.json()

    // Validate required fields
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required and must be a string" },
        { status: 400 }
      )
    }

    if (!sender || !["customer", "admin"].includes(sender)) {
      return NextResponse.json(
        { error: "Sender must be either 'customer' or 'admin'" },
        { status: 400 }
      )
    }

    // Verify order exists
    const orderExists = await prisma.order.findUnique({
      where: { id: params.id },
      select: { id: true },
    })

    if (!orderExists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Create message
    const message = await prisma.whatsappMessage.create({
      data: {
        content,
        sender,
        orderId: params.id, // Use the validated orderId from params
      },
    })

    // If admin message, update last message time
    if (sender === "admin") {
      await prisma.order.update({
        where: { id: params.id },
        data: { customerLastMessagedAt: new Date() },
      })
    }

    return NextResponse.json({
      ...message,
      timestamp: message.timestamp.toISOString(),
      readAt: message.readAt?.toISOString(),
    })
  } catch (error: any) {
    console.error("Error creating message:", error)
    return NextResponse.json(
      {
        error: "Failed to create message",
        details: error.message,
      },
      { status: 500 }
    )
  }
}

// export async function POST(
//   req: Request,
//   { params }: { params: { orderId: string } }
// ) {
//   try {
//     const { content, sender } = await req.json()

//     // Create message
//     const message = await prisma.whatsappMessage.create({
//       data: {
//         content,
//         sender,
//         orderId: params.orderId,
//       },
//     })

//     // If admin message, update last message time
//     if (sender === "admin") {
//       await prisma.order.update({
//         where: { id: params.orderId },
//         data: { customerLastMessagedAt: new Date() },
//       })
//     }

//     return NextResponse.json({
//       ...message,
//       timestamp: message.timestamp.toISOString(),
//       readAt: message.readAt?.toISOString(),
//     })
//   } catch (error) {
//     console.error("Error creating message:", error)
//     return NextResponse.json(
//       { error: "Failed to create message" },
//       { status: 500 }
//     )
//   }
// }

// export async function POST(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // Validate orderId
//     if (!params.id || params.id.length !== 24) {
//       return NextResponse.json(
//         { error: "Invalid order ID format" },
//         { status: 400 }
//       )
//     }

//     const { content, sender } = await req.json()

//     // Validate input
//     if (!content || typeof content !== "string") {
//       return NextResponse.json(
//         { error: "Content is required and must be a string" },
//         { status: 400 }
//       )
//     }

//     if (!sender || !["customer", "admin"].includes(sender)) {
//       return NextResponse.json(
//         { error: "Sender must be either 'customer' or 'admin'" },
//         { status: 400 }
//       )
//     }

//     // Check if order exists
//     const orderExists = await prisma.order.findUnique({
//       where: { id: params.id },
//       select: { id: true },
//     })

//     if (!orderExists) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 })
//     }

//     // Create message
//     const message = await prisma.whatsappMessage.create({
//       data: {
//         content,
//         sender,
//         orderId: params.id,
//       },
//     })

//     // If sender is admin, update customerLastMessagedAt
//     if (sender === "admin") {
//       await prisma.order.update({
//         where: { id: params.id },
//         data: { customerLastMessagedAt: new Date() },
//       })
//     }

//     return NextResponse.json({
//       success: true,
//       message: {
//         ...message,
//         timestamp: message.timestamp.toISOString(),
//       },
//     })
//   } catch (error: any) {
//     console.error("Error in messages POST endpoint:", error)
//     return NextResponse.json(
//       {
//         error: "Failed to create message",
//         details: error.message,
//       },
//       { status: 500 }
//     )
//   }
// }
