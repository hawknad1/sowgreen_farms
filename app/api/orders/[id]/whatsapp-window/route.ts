// app/api/orders/[orderId]/whatsapp-window/route.ts
import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

// export async function GET(
//   req: Request,
//   { params }: { params: { orderId: string } }
// ) {
//   try {
//     const order = await prisma.order.findUnique({
//       where: { id: params.orderId },
//       select: { customerLastMessagedAt: true },
//     })

//     const isWithin24Hours = order?.customerLastMessagedAt
//       ? new Date().getTime() -
//           new Date(order.customerLastMessagedAt).getTime() <
//         24 * 60 * 60 * 1000
//       : false

//     return NextResponse.json({ isWithin24Hours })
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to check WhatsApp window" },
//       { status: 500 }
//     )
//   }
// }

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate orderId
    if (!params.id || params.id.length !== 24) {
      return NextResponse.json(
        { error: "Invalid order ID format" },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      select: { customerLastMessagedAt: true },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Calculate 24-hour window
    const now = new Date()
    const isWithin24Hours = order.customerLastMessagedAt
      ? now.getTime() - new Date(order.customerLastMessagedAt).getTime() <
        24 * 60 * 60 * 1000
      : false

    return NextResponse.json({
      success: true,
      isWithin24Hours,
      lastMessageTime: order.customerLastMessagedAt?.toISOString(),
      currentTime: now.toISOString(),
    })
  } catch (error: any) {
    console.error("Error in whatsapp-window endpoint:", error)
    return NextResponse.json(
      {
        error: "Failed to check WhatsApp window",
        details: error.message,
      },
      { status: 500 }
    )
  }
}
