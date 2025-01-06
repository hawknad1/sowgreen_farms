// import { sowgreenWorkers } from "@/constants"
// import { Order } from "@/types"

// interface OrderItem {
//   product: string
//   quantity: string
//   price: string
// }

// interface Contact {
//   name: string
//   phone: string
// }

// export function generateOrderConfirmationMessage(order: Order): string {
//   const itemsList = order.products
//     .map(({ product, quantity, available }) => {
//       if (!product) {
//         return "- Product details missing" // Handle missing product details
//       }

//       if (available === false) {
//         return `- ${product.title}: N/A` // Show product as unavailable
//       }

//       const weight = product.weight
//         ? `${product.weight < 1 ? product.weight * 1000 : product.weight}${
//             product.unit
//           }`
//         : "" // Include weight if available
//       return `- ${weight} ${product.title}: GHS ${product.price} (Qty: ${quantity})`
//     })
//     .join("\n")

//   const contactList = sowgreenWorkers
//     .map((contact) => `- ${contact.name}: ${contact.phone}`)
//     .join("\n")

//   return `
// *Order Confirmation: ${order.orderNumber}*

// Hello *${order.shippingAddress.name}*,

// Your order has been confirmed and is now being prepared for delivery.

// *Delivery Date:* ${order.deliveryMethod}

// *Delivery Address:* ${order.shippingAddress.address}, ${
//     order.shippingAddress.city
//   }
// *Contact:* ${order.shippingAddress.phone}

// *Order Summary:*
// ${itemsList}

// *Delivery Fee:* ${order.deliveryFee}

// *Total Amount:* GHS ${(order.total + order.deliveryFee).toFixed(2)}

// *Your order is ready!*
// Go to *Order History* in the app and click *Pay*. We accept *Mobile Money* and *Card*.

// If you have any questions or need assistance, please contact:
// ${contactList}

// Thank you for choosing SowGreen Organic Farms. We look forward to serving you!
//   `.trim()
// }

export async function generateOrderConfirmationMessage({}) {}
