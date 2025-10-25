import { Order } from "@/types"
import { generateOrderConfirmationMessage } from "./whatsAppMessages/generateOrderConfirmationMessage"
import { generateOrderReceivedMessage } from "./whatsAppMessages/generateOrderReceivedMessage"
import { generateUpdatedDeliveryMethod } from "./whatsAppMessages/generateUpdatedDeliveryMethod"

// interface Product {
//   quantity: number
//   quantityTotal: number
//   available: boolean
//   weight?: number
//   unit?: string
//   product: {
//     title: string
//   }
// }

// interface ShippingAddress {
//   name: string
//   address: string
//   city: string
//   region: string
//   phone: string
//   deliveryMethod?: string
// }

// export type Order = {
//   id?: string
//   orderNumber: string
//   referenceNumber?: string
//   total: number
//   status?: "processing" | "shipped" | "delivered"
//   dispatchRider?: string
//   deliveryMethod: string
//   deliveryFee: number
//   cardType?: string
//   last4Digits?: string
//   paymentMode?: string
//   paymentAction?: string
//   shippingAddress: ShippingAddress
//   products: Product[] // Change from Product[] to ProductOrder[]
//   createdAt?: string
// }

export async function sendOrderConfirmation(order: Order) {
  try {
    const response = await fetch("/api/send-whatsapp-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error("Failed to send WhatsApp message")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error sending order confirmation:", error)
    throw error
  }
}

// export async function sendPickupOrderConfirmation(order: Order) {
//   try {
//     const response = await fetch(
//       "http://localhost:3000/api/send-whatsapp-message-pickup-order",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(order),
//       }
//     )

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error("Error response:", errorText)
//       throw new Error("Failed to send WhatsApp message")
//     }

//     const data = await response.json()
//     return data
//   } catch (error) {
//     console.error("Error sending order confirmation:", error)
//     throw error
//   }
// }

export async function sendPickupOrderConfirmation(order: Order) {
  try {
    const response = await fetch("/api/send-whatsapp-message-pickup-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error("Failed to send WhatsApp message")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error sending order confirmation:", error)
    throw error
  }
}

export async function sendOrderConfirmationGroup(order: Order) {
  try {
    const response = await fetch("/api/whatsapp/conversations/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error("Failed to send WhatsApp message")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error sending order confirmation:", error)
    throw error
  }
}

export async function sendPickupOrderConfirmationGroup(order: Order) {
  try {
    const response = await fetch(
      "/api/whatsapp/conversations/send-message-pickup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error("Failed to send WhatsApp message")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error sending order confirmation:", error)
    throw error
  }
}

export async function sendCustomerNoteGroup(order: Order) {
  try {
    const response = await fetch("/api/whatsapp/customer-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error("Failed to send WhatsApp message")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error sending order confirmation:", error)
    throw error
  }
}

export async function sendCustomerNotes(order: Order) {
  const to = order?.dispatchRider.phone
  try {
    const response = await fetch("/api/whatsapp/customer-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        order,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error("Failed to send WhatsApp message")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error sending order confirmation:", error)
    throw error
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

// export async function sendSms(order: Order) {
//   const message = generateOrderConfirmationMessage(order)

//   try {
//     const response = await fetch("/api/sendWhatsapp", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         to: order?.shippingAddress?.phone, // Customer's WhatsApp number
//         message,
//       }),
//     })

//     if (response.ok) {
//       const data = await response.json()
//     }
//   } catch (error) {
//     console.error("Error sending message:", error)
//   }
// }
