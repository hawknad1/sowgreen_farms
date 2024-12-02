import { Order } from "@/types"
import { generateOrderConfirmationMessage } from "../generateOrderConfirmationMessage"
import { generateOrderReceivedMessage } from "../generateOrderReceivedMessage"

export async function sendOrderConfirmation(order: any) {
  const message = generateOrderConfirmationMessage(order)

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

    if (response.ok) {
      const data = await response.json()
    }
  } catch (error) {
    console.error("Error sending message:", error)
  }
}

export async function sendOrderReceived(order: any) {
  const message = generateOrderReceivedMessage(order)

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

    if (response.ok) {
      const data = await response.json()
    }
  } catch (error) {
    console.error("Error sending message:", error)
  }
}
