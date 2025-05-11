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
  const deliveryMethod =
    order?.shippingAddress?.deliveryMethod || "Not specified"
  const deliveryAddress = `${order?.shippingAddress?.address}, ${order?.shippingAddress?.city}`

  // Contact list placeholder (update with actual contacts)
  const contactList = sowgreenWorkers
    .map(({ name, phone }) => `- ${name}: ${phone}`)
    .join("\n")

  // Generate final message
  return `
Hello *${order?.shippingAddress?.name}*,

Your order ${order?.orderNumber} is confirmed and ready for delivery!
Visit our website under Order History and complete your payment through your preferred method. 

📅 *Delivery Date:* ${order?.deliveryDate || "Not specified"}.
🚚 *Delivery Method:* ${deliveryMethod}.
📍 *Delivery Address:* ${deliveryAddress}.

*Order Summary:*
${itemsList}

*Total:* ${formatCurrency(
    order?.total + order.deliveryFee,
    "GHS"
  )} (incl. ${formatCurrency(order?.deliveryFee, "GHS")})

For questions, contact ${contactList[0]} or ${contactList[1]}

Thank you for choosing *SowGreen Organic Farms*!
`.trim()
}

// Hello *${order.shippingAddress.name}*,

// Your order is ready for delivery! Please visit *sowgreen.com*,
// go to *Order History*, and click *Pay* on your order.
// We accept Mobile Money, Card, or Cash on Delivery.

// *Delivery Date:* ${order.deliveryDate || "Not specified"}
// *Delivery Method:* ${deliveryMethod}
// *Delivery Address:* ${deliveryAddress}
// *Contact:* ${order.shippingAddress.phone}

// *Order Summary:*
// ${itemsList}

// *Delivery Fee:* ${formatCurrency(order.deliveryFee, "GHS")}
// *Total Amount:* ${formatCurrency(order.total + order.deliveryFee, "GHS")}

// If you have any questions or need assistance, please contact:
// ${contactList}

// Thank you for choosing *SowGreen Organic Farms*.
// We look forward to serving you!
// `.trim()

// Hello Thomas,

// Your order #SG12345 is ready for delivery!

// Visit our website under Order History and complete your payment through your preferred method.

// 📅 *Delivery Date:* Wednesday, Jan 22nd.
// 🚚 *Delivery Method:* Home Delivery.
// 🏠 *Delivery Address:* 175th Harrison Rd
// 📞 *Contact:* 0245847649

// 🛒 *Order Summary:*
// 1kg Avocado (QTY :1) GHC 45.00

// 💰 *Delivery Fee:* GHC 45.00
// 💳 *Total Amount:* GHC 90.00

// For assistance, reach out to our support team at 0245847649.

// Thank you for choosing *SowGreen Organic Farms*! 🌱
// We look forward to serving you.
