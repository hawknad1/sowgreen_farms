import { Order } from "@/types"
import { generateOrderMessage } from "../generateOrderMessage"

export async function sendWhatsAppMessage(order: any) {
  const message = generateOrderMessage(order)

  try {
    const response = await fetch("/api/sendWhatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "+233204785693", // Customer's WhatsApp number
        message,
      }),
    })

    const data = await response.json()
    if (response.ok) {
      console.log("Message sent successfully:", data.sid)
    } else {
      console.error("Failed to send message:", data.error)
    }
  } catch (error) {
    console.error("Error sending message:", error)
  }
}
