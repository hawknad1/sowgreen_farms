import { sowgreenWorkers } from "@/constants"
import { formatCurrency } from "@/lib/utils"
import { Order, ShippingAddress } from "@/types"

interface OrderItem {
  product: string
  quantity: string
  price: string
}

interface Contact {
  name: string
  phone: string
}

// export type ProductOrder = {
//   item: {
//     id: string
//     title: string
//     categoryName: string
//     description: string
//     imageUrl: string
//     price: number
//     weight: number
//     unit: string
//     isInStock: string
//     discount: number
//     quantity: number
//     purchaseCount: number
//     createdAt: string
//     updatedAt: string
//   }
//   total: number
//   quantity: number
// }

// export type ProductOrder = {
//   product: {
//     id: string
//     title: string
//     categoryName: string
//     description: string
//     imageUrl: string
//     price: number
//     weight: number
//     unit: string
//     isInStock: string
//     discount: number
//     quantity: number
//     purchaseCount: number
//     createdAt: string
//     updatedAt: string
//   }
//   total: number
//   quantity: number
// }

// interface Product {
//   quantity: number
//   quantityTotal: number
//   available: boolean
//   weight?: number
//   unit?: string
//   price?: number
//   product: {
//     title: string
//   }
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

export function generateOrderConfirmationMessage(order: Order): string {
  const itemsList = order.products
    .map((p) => {
      if (!p) {
        return "- Product details missing"
      }

      if (p.available === false) {
        return `❌ ${p.product.title} : *N/A*` // Show product as unavailable
      }
      const weight = p.weight ? `${p.weight}${p.unit}` : ""
      return `✅ ${p.quantity}x ${
        p.product.title
      } - ${weight} - ${formatCurrency(Number(p.quantityTotal), "GHS")}`
    })
    .join("\n")

  const contactList = sowgreenWorkers
    .map((contact) => `- ${contact.name}: ${contact.phone}`)
    .join("\n")

  return `
Hello *${order.shippingAddress.name}*,

Below is the complete list of products for Order #${order?.orderNumber}

*Order Summary:*
${itemsList}
    `.trim()
}
