import { Order } from "@/types"
import { generateOrderConfirmationMessage } from "./whatsAppMessages/generateOrderConfirmationMessage"
import { generateOrderReceivedMessage } from "./whatsAppMessages/generateOrderReceivedMessage"
import { generateUpdatedDeliveryMethod } from "./whatsAppMessages/generateUpdatedDeliveryMethod"
import { sowgreenWorkers } from "@/constants"

// export async function sendOrderConfirmation(order: Order) {
//   const message = generateOrderConfirmationMessage(order)
//   console.log("Generated message:", message)

//   try {
//     const response = await fetch("/api/sendWhatsapp", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         customerPhone: order?.shippingAddress?.phone, // Customer's WhatsApp number
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

// export async function sendOrderConfirmation(order: Order) {
//   const workersName = sowgreenWorkers.map((worker) => worker.name)
//   const workersNumber = sowgreenWorkers.map((worker) => worker.phone)
//   const workerOne = `${workersName[0]} - ${workersNumber[0]}`
//   const workerTwo = `${workersName[1]} - ${workersNumber[1]}`

//   try {
//     const response = await fetch("/api/send-whatsapp", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(order),
//     })

//     if (response.ok) {
//       const data = await response.json()
//       return data
//     }
//     throw new Error("Failed to send message")
//   } catch (error) {
//     console.error("Error sending message:", error)
//     throw error
//   }
// }

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

export async function sendSms(order: Order) {
  const message = generateOrderConfirmationMessage(order)

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
