import { auth } from "@/auth"
import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

// app/api/orders/[id]/read-replies/route.ts
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Mark all unread replies as read
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      select: { repliedNotes: true },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const updatedNotes = order.repliedNotes.map((note) => ({
      ...note,
      read: true,
      readAt: note.read ? note.readAt : new Date(),
    }))

    await prisma.order.update({
      where: { id: params.id },
      data: { repliedNotes: updatedNotes },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking replies as read:", error)
    return NextResponse.json(
      { error: "Failed to update read status" },
      { status: 500 }
    )
  }
}
