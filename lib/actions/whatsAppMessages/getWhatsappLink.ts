// import { Order } from "@/types"

// function getWhatsAppLinkText(order: Order): string {
//   const orderId = order?.id || "unknown"
//   return `View your order #${orderId} on WhatsApp: https://wa.me/15557258086?text=${encodeURIComponent(
//     `View Order #${orderId}`
//   )}`
// }

// export async function sendSms(order: any) {
//   const message = getWhatsAppLinkText(order)

//   try {
//     const response = await fetch("/api/sendSms", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         to: order?.shippingAddress?.phone,
//         message: message,
//       }),
//     })

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     return await response.json()
//   } catch (error) {
//     console.error("Error sending message:", error)
//     throw error
//   }
// }

export async function sendSms(order: any) {
  console.log("SMS SENT")
  const message = `View your order #${
    order?.id
  } on WhatsApp: https://wa.me/15557258086?text=${encodeURIComponent(
    `View Order #${order?.id}`
  )}`

  try {
    const response = await fetch("/api/sendSms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: order?.shippingAddress?.phone,
        message: "Hello, Tommy...Testing",
      }),
    })

    if (!response.ok) {
      // Try to get error details from response
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Failed to send SMS: ${response.status} ${response.statusText}. ${
          errorData.error || ""
        }`
      )
    }

    return await response.json()
  } catch (error) {
    console.error("Full SMS error:", error)
    throw error
  }
}
