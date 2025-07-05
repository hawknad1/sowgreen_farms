import { Order } from "@/types"

export async function generateNotesReply(order: Order) {
  return `${order?.specialNotes}`.trim()
}
