// // lib/orderHelpers.ts
// import twilio from "twilio"

// const accountSid = process.env.TWILIO_ACCOUNT_SID!
// const authToken = process.env.TWILIO_AUTH_TOKEN!
// const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER!

// const client = twilio(accountSid, authToken)

// const MAX_WHATSAPP_MESSAGE_LENGTH = 4096
// const MESSAGE_TRUNCATE_BUFFER = 10

// interface Product {
//   id: string
//   name: string
//   quantity: number
//   price: number // Assuming price is a number
//   // Add any other relevant product fields
// }
// interface Order {
//   id: string // Unique order identifier
//   products: Product[]
//   customerName?: string // Optional: for personalization
// }

// export async function sendErrorMessage(to: string, message: string) {
//   try {
//     await client.messages.create({
//       body: message,
//       from: `whatsapp:${whatsappNumber}`,
//       to,
//     })
//   } catch (error) {
//     console.error("Failed to send error message:", error)
//   }
// }

// export function buildOrderSummary(order: Order): string {
//   const customerGreeting = order.customerName
//     ? `Hi ${order.customerName}, here's your order summary for #${order.id}:`
//     : `Hi, here's your order summary for #${order.id}:`

//   const itemsList = order.products
//     .map(
//       (p, i) =>
//         `${i + 1}. ${p.product.name} (Qty: ${p.quantity}) - $${(
//           p.product.price * p.quantity
//         ).toFixed(2)}`
//     )
//     .join("\n")

//   const subtotal = order.products.reduce(
//     (sum, p) => sum + p.product.price * p.quantity,
//     0
//   )

//   let messageBody = `
// ${customerGreeting}

// ${itemsList}

// Total Items: ${order.products.reduce((sum, p) => sum + p.quantity, 0)}
// Subtotal: $${subtotal.toFixed(2)}

// For questions, contact our support team.`

//   if (messageBody.length > MAX_WHATSAPP_MESSAGE_LENGTH) {
//     messageBody =
//       messageBody.substring(
//         0,
//         MAX_WHATSAPP_MESSAGE_LENGTH - MESSAGE_TRUNCATE_BUFFER
//       ) + "\n... (truncated)"
//   }

//   return messageBody
// }

// export async function sendWhatsAppMessage(to: string, body: string) {
//   const sentMessage = await client.messages.create({
//     body,
//     from: `whatsapp:${whatsappNumber}`,
//     to,
//   })
//   return sentMessage
// }
