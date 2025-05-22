import { sowgreenWorkers } from "@/constants"
import { formatCurrency } from "@/lib/utils"
import { Order } from "@/types"

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

  return `
Hello *${order.shippingAddress.name}*,

Below is the complete list of products for Order #${order?.orderNumber}

*Order Summary:*
${itemsList}
    `.trim()
}
