// app/api/orders/[orderId]/messages/read/route.ts
import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.whatsappMessage.updateMany({
      where: {
        orderId: params.id,
        sender: "admin",
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    )
  }
}
