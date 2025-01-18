import { sowgreenWorkers } from "@/constants"
import { ShippingAddress } from "@/types"

export type ProductOrder = {
  item: {
    id: string
    title: string
    categoryName: string
    description: string
    imageUrl: string
    price: number
    weight: number
    unit: string
    isInStock: string
    discount: number
    quantity: number
    purchaseCount: number
    createdAt: string
    updatedAt: string
  }
  total: number
  quantity: number
}

export type Order = {
  id?: string
  orderNumber: string
  referenceNumber?: string
  total: number
  status?: "processing" | "shipped" | "delivered"
  dispatchRider?: string
  deliveryMethod: string
  deliveryFee: number
  cardType?: string
  last4Digits?: string
  paymentMode?: string
  paymentAction?: string
  shippingAddress: ShippingAddress
  products: ProductOrder[] // Change from Product[] to ProductOrder[]
  createdAt?: string
}

interface OrderItem {
  product: string
  quantity: string
  price: string
}

interface Contact {
  name: string
  phone: string
}

// export function generateOrderReceivedMessage(order: Order): string {
//   const itemsList = order.products
//     .map(({ item, quantity }) => {
//       if (!item) {
//         return "- Product details missing" // Handle missing product details
//       }
//       const weight = item.weight ? `${item.weight}${item.unit}` : "" // Include weight if available
//       return `- ${weight} ${item.title}: GHS ${item.price} (Qty: ${quantity})`
//     })
//     .join("\n")

//   const contactList = sowgreenWorkers
//     .map((contact) => `- ${contact.name}: ${contact.phone}`)
//     .join("\n")

//   return `
// *Your order has been received: ${order.orderNumber}*

// Hello *${order.shippingAddress.name}*,

// Thank you for your order! Here are the details:

// *Delivery Date:* ${order.deliveryMethod}

// *Delivery Address:* ${order.shippingAddress.address}, ${
//     order.shippingAddress.city
//   }
// *Contact:* ${order.shippingAddress.phone}

// *Order Summary:*
// ${itemsList}

// *Total Amount:* GHS ${(order.total + order.deliveryFee).toFixed(2)}

// If you have any questions or need assistance, please contact:
// ${contactList}

// Thank you for choosing SowGreen Organic Farms. We look forward to serving you!
//     `.trim()
// }
export function generateOrderReceivedMessage(order: Order): string {
  const contactList = sowgreenWorkers
    .map((contact) => `- ${contact.name}: ${contact.phone}`)
    .join("\n")

  return `
*Your order has been received: ${order.orderNumber}*
  
Hello *${order.shippingAddress.name}*,
  
We’ve successfully received your order, and it’s now being processed.

Please note that once your order is confirmed, it cannot be modified.
Rest assured, our team is working on confirming your order as quickly as possible.

If you have any questions or need assistance, please contact:  
${contactList}
  
Thank you for choosing SowGreen Organic Farms. We look forward to serving you!
    `.trim()
}
