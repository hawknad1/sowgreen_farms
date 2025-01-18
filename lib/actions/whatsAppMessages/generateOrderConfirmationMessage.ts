// import { sowgreenWorkers } from "@/constants"
// import { Order } from "@/types"

import { sowgreenWorkers } from "@/constants"
import { formatCurrency } from "@/lib/utils"
import { Order } from "@/types"

interface OrderItem {
  product: string
  quantity: string
  price: string
}

interface Contact {
  name: string
  phone: string
}

// export function generateOrderConfirmationMessage(order: Order): string {
//   // Generate list of ordered products
//   const itemsList = order.products
//     .map(({ product, quantity, weight, unit, price, available }) => {
//       if (!product) {
//         return "- Product details missing" // Handle missing product details
//       }

//       if (available === false) {
//         return `- ${product.title}: N/A` // Show product as unavailable
//       }

//       const productWeight = weight
//         ? `${weight < 1 ? weight * 1000 : weight}${unit || ""}`
//         : "N/A" // Format weight if available

//       return `- ${productWeight} ${product.title}: GHS ${price.toFixed(
//         2
//       )} (Qty: ${quantity})`
//     })
//     .join("\n")

//   // Generate delivery details
//   const deliveryMethod = order.shippingAddress.deliveryMethod || "Not specified"
//   const deliveryAddress = `${order.shippingAddress.address}, ${order.shippingAddress.city}`

//   // Contact list placeholder (update with actual contacts)
//   const contactList = sowgreenWorkers
//     .map(({ name, phone }) => `- ${name}: ${phone}`)
//     .join("\n")

//   // Generate final message
//   return `
//   Hello *${order.shippingAddress.name}*,

//   Your order is ready for delivery! Please visit *sowgreen.com*,
//   go to *Order History*, and click *Pay* on your order.
//   We accept Mobile Money, Card, or Cash on Delivery.

//   *Delivery Date:* ${order.deliveryDate || "Not specified"}
//   *Delivery Method:* ${deliveryMethod}
//   *Delivery Address:* ${deliveryAddress}
//   *Contact:* ${order.shippingAddress.phone}

//   *Order Summary:*
//   ${itemsList}

//   *Delivery Fee:* ${formatCurrency(order.deliveryFee, "GHS")}
//   *Total Amount:* ${formatCurrency(order.total + order.deliveryFee, "GHS")}

//   If you have any questions or need assistance, please contact:
//   ${contactList}

//   Thank you for choosing SowGreen Organic Farms.
//   We look forward to serving you!
//   `.trim()
// }

export function generateOrderConfirmationMessage(order: Order): string {
  // Generate list of ordered products
  const itemsList = order.products
    .map(({ product, quantity, weight, unit, price, available }) => {
      if (!product) {
        return "- Product details missing" // Handle missing product details
      }

      if (available === false) {
        return `- ${product.title}: *N/A*` // Show product as unavailable
      }

      const productWeight = weight
        ? `${weight < 1 ? weight * 1000 : weight}${unit || ""}`
        : "N/A" // Format weight if available

      return `- ${productWeight} ${product.title}: GHS ${price.toFixed(
        2
      )} (Qty: ${quantity})`
    })
    .join("\n")

  // Generate delivery details
  const deliveryMethod = order.shippingAddress.deliveryMethod || "Not specified"
  const deliveryAddress = `${order.shippingAddress.address}, ${order.shippingAddress.city}`

  // Contact list placeholder (update with actual contacts)
  const contactList = sowgreenWorkers
    .map(({ name, phone }) => `- ${name}: ${phone}`)
    .join("\n")

  // Generate final message
  return `
Hello *${order.shippingAddress.name}*,

Your order is ready for delivery! Please visit *sowgreen.com*, 
go to *Order History*, and click *Pay* on your order.
We accept Mobile Money, Card, or Cash on Delivery.

*Delivery Date:* ${order.deliveryDate || "Not specified"}
*Delivery Method:* ${deliveryMethod}
*Delivery Address:* ${deliveryAddress}
*Contact:* ${order.shippingAddress.phone}

*Order Summary:*
${itemsList}

*Delivery Fee:* ${formatCurrency(order.deliveryFee, "GHS")}
*Total Amount:* ${formatCurrency(order.total + order.deliveryFee, "GHS")}

If you have any questions or need assistance, please contact:
${contactList}

Thank you for choosing *SowGreen Organic Farms*. 
We look forward to serving you!
`.trim()
}
