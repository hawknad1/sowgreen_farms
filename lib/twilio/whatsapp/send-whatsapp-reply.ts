// import { Order } from "@/types"

import { Order } from "@/constants"

// // lib/sendWhatsAppMessage.ts
// export const sendWhatsappReply = async (
//   formattedPhone: string,
//   currentOrder: Order
// ) => {
//   try {
//     const response = await fetch("/api/whatsapp/reply-note", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         to: formattedPhone,
//         order: currentOrder,
//       }),
//     })

//     if (!response.ok) {
//       throw new Error("Failed to send WhatsApp message")
//     }

//     return await response.json()
//   } catch (error) {
//     console.error("Error sending WhatsApp message:", error)
//     throw error
//   }
// }

export const sendWhatsappReply = async (
  formattedPhone: string,
  order: Order
) => {
  try {
    if (!order?.id || !order?.shippingAddress?.name) {
      throw new Error("Incomplete order data for WhatsApp message")
    }

    const response = await fetch("/api/whatsapp/reply-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: formattedPhone,
        order: {
          id: order.id,
          shippingAddress: order.shippingAddress,
          // Only send necessary data
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send WhatsApp message")
    }

    return await response.json()
  } catch (error) {
    console.error("Error sending WhatsApp message:", error)
    throw error
  }
}
