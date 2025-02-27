import { Order } from "@/types"
import { generateOrderConfirmationMessage } from "./whatsAppMessages/generateOrderConfirmationMessage"
import { generateOrderReceivedMessage } from "./whatsAppMessages/generateOrderReceivedMessage"
import { generateUpdatedDeliveryMethod } from "./whatsAppMessages/generateUpdatedDeliveryMethod"

export async function sendOrderConfirmation(order: Order) {
  const message = generateOrderConfirmationMessage(order)
  console.log("Generated message:", message)

  try {
    const response = await fetch("/api/sendWhatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // to: "+233204785693", // Customer's WhatsApp number
        to: order?.shippingAddress?.phone, // Customer's WhatsApp number
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
  // const message = generateOrderConfirmationMessage(order)
  console.log(order, "order from whatsapp")

  try {
    const response = await fetch("/api/sendWhatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // to: "+233204785693", // Customer's WhatsApp number
        to: order?.shippingAddress?.phone, // Customer's WhatsApp number
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

export async function sendUpdatedDeliveryMethod() {
  const message = generateUpdatedDeliveryMethod()

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
