import { whatsAppOrderLink } from "@/app/(root)/checkout/WhatsappOrderLink"

export async function sendSms(order: any) {
  // Fix: Pass the order as an object with the expected structure
  const message = whatsAppOrderLink({ order })
  console.log(message, "WHATSAPP LINK")

  try {
    const response = await fetch("/api/sendSms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: order?.shippingAddress?.phone,
        message: message.props.children[1].props.href, // Extract the WhatsApp link
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error sending message:", error)
    throw error // Re-throw to allow handling by the caller
  }
}
