// interface Product {
//   quantity: number
//   quantityTotal: string
//   product: {
//     title: string
//     partner: {
//       brand: string
//     } | null
//   }
//   weight?: number
//   unit?: string
// }

import { Order, Product, ProductOrder } from "@/types"

// interface Order {
//   orderNumber: string
//   deliveryDate: string
//   subtotal: number
//   deliveryFee: number
//   creditAppliedTotal: number
//   total: number
//   totalDue: number | null
//   shippingAddress: {
//     name: string
//     address: string
//     city: string
//     phone: string
//   }
//   dispatchRider: {
//     phone: string
//   }
//   products: Product[]
// }

export function formatOrderMessage(order: Order): string {
  const customerName = order?.shippingAddress?.name.split(" ")[0]

  // Group products by partner
  const productsByPartner: { [key: string]: ProductOrder[] } = {}

  order.products.forEach((item) => {
    const partnerName = item.product.partner?.brand || "SOWGREEN ORGANIC"
    if (!productsByPartner[partnerName]) {
      productsByPartner[partnerName] = []
    }
    productsByPartner[partnerName].push(item)
  })

  // Build product list
  let productList = ""
  Object.entries(productsByPartner).forEach(([partnerName, items]) => {
    productList += `🏪 *${partnerName}*\n`
    items.forEach((item) => {
      const title =
        item.product.title.length > 25
          ? item.product.title.substring(0, 22) + "..."
          : item.product.title

      // Use weight and unit directly from ProductOrder
      const unit = item.weight && item.unit ? ` ${item.weight}${item.unit}` : ""

      productList += `✅ ${item.quantity || 1}x ${title}${unit} - GHS ${parseFloat(item.quantityTotal?.toString() || "0").toFixed(2)}\n`
    })
  })

  const message = `Hello ${customerName},
Your order ${order?.orderNumber} is confirmed and ready for Pickup!
Visit our website under Order History and complete your payment through your preferred method. 
📅 Pickup Date: ${order?.deliveryDate} 
📍 Pickup Location: ${order?.shippingAddress.address}, ${order?.shippingAddress?.city} 
📞 Contact: ${order?.shippingAddress?.phone}
*Ordered Items:*
${productList}────────────────────
💰 Subtotal:  GHS ${order.subtotal.toFixed(2)}
🚚 Delivery Fee: GHS ${order.deliveryFee.toFixed(2)}  
💲 Credit Bal.: GHS ${(order.creditAppliedTotal || 0).toFixed(2)}
💸 Total Amount: GHS ${order.total.toFixed(2)}
💳 Total Due: GHS ${(order.totalDue || order.total).toFixed(2)}
For assistance, reach out to our support team at 
 Kwaku: 0553121737 or
 Samira: 0241234234
Thank you for choosing SowGreen Organic Farms! 🌱  
We look forward to serving you.`

  return message
}

// export function formatOrderMessageVariables(order: Order): string {
//   const productsByPartner: { [key: string]: ProductOrder[] } = {}

//   order.products.forEach((item) => {
//     const partnerName = item.product.partner?.brand || "SOWGREEN ORGANIC"
//     if (!productsByPartner[partnerName]) {
//       productsByPartner[partnerName] = []
//     }
//     productsByPartner[partnerName].push(item)
//   })

//   let productList = ""
//   Object.entries(productsByPartner).forEach(([partnerName, items]) => {
//     productList += `🏪 *${partnerName}*\n`
//     items.forEach((item) => {
//       const title =
//         item.product.title.length > 25
//           ? item.product.title.substring(0, 22) + "..."
//           : item.product.title

//       const unit = item.weight && item.unit ? ` ${item.weight}${item.unit}` : ""

//       productList += `✅ ${item.quantity || 1}x ${title}${unit} - GHS ${parseFloat(
//         item.quantityTotal?.toString() || "0"
//       ).toFixed(2)}\n`
//     })
//     productList += "\n"
//   })

//   return productList.trim()
// }

export function formatOrderMessageVariables(order: Order): string {
  const productsByPartner: { [key: string]: ProductOrder[] } = {}

  order.products.forEach((item) => {
    const partnerName = item.product.partner?.brand || "SOWGREEN ORGANIC"
    if (!productsByPartner[partnerName]) {
      productsByPartner[partnerName] = []
    }
    productsByPartner[partnerName].push(item)
  })

  // Simple list format - let the template handle styling
  let productList = ""
  Object.entries(productsByPartner).forEach(([partnerName, items], index) => {
    // if (index > 0) productList += "\n"
    productList += `${partnerName}`
    items.forEach((item) => {
      const title =
        item.product.title.length > 30
          ? item.product.title.substring(0, 27) + "..."
          : item.product.title

      const unit = item.weight && item.unit ? ` ${item.weight}${item.unit}` : ""

      productList += `${item.quantity}x ${title}${unit} - GHS ${parseFloat(
        item.quantityTotal?.toString() || "0"
      ).toFixed(2)}`
    })
  })

  return productList.trim()
}

export function formatOrderMessageVariables_Bullets(order: Order): string {
  const productsByPartner: { [key: string]: ProductOrder[] } = {}

  order.products.forEach((item) => {
    const partnerName = item.product.partner?.brand || "SOWGREEN ORGANIC"
    if (!productsByPartner[partnerName]) {
      productsByPartner[partnerName] = []
    }
    productsByPartner[partnerName].push(item)
  })

  let productList = ""
  Object.entries(productsByPartner).forEach(
    ([partnerName, items], partnerIndex) => {
      if (partnerIndex > 0) productList += "  •  "
      productList += `${partnerName}: `

      items.forEach((item, itemIndex) => {
        const title =
          item.product.title.length > 25
            ? item.product.title.substring(0, 22) + "..."
            : item.product.title

        const unit =
          item.weight && item.unit ? ` ${item.weight}${item.unit}` : ""

        if (itemIndex > 0) productList += " • "
        productList += `${item.quantity}x ${title}${unit} GHS${parseFloat(
          item.quantityTotal?.toString() || "0"
        ).toFixed(2)}`
      })
    }
  )

  return productList.trim()
}

// export function formatOrderMessage(order: Order): string {
//   const customerName = order?.shippingAddress?.name.split(" ")[0]

//   // Group products by partner
//   const productsByPartner: { [key: string]: Product[] } = {}

//   order.products.forEach((item) => {
//     const partnerName = item.product.partner?.brand || "SOWGREEN ORGANIC"
//     if (!productsByPartner[partnerName]) {
//       productsByPartner[partnerName] = []
//     }
//     productsByPartner[partnerName].push(item)
//   })

//   // Build product list
//   let productList = ""
//   Object.entries(productsByPartner).forEach(([partnerName, items]) => {
//     productList += `🏪 *${partnerName}*\n`
//     items.forEach((item) => {
//       const title =
//         item.title.length > 25
//           ? item.title.substring(0, 22) + "..."
//           : item.title
//       const unit = item.weight && item.unit ? ` ${item.weight}${item.unit}` : ""
//       productList += `✅ ${item.quantity}x ${title}${unit} - GHS ${parseFloat(item.quantityTotal).toFixed(2)}\n`
//     })
//   })

//   const message = `Hello ${customerName},
// Your order ${order?.orderNumber} is confirmed and ready for Pickup!
// Visit our website under Order History and complete your payment through your preferred method.
// 📅 Pickup Date: ${order?.deliveryDate}
// 📍 Pickup Location: ${order?.shippingAddress.address}, ${order?.shippingAddress?.city}
// 📞 Contact: ${order?.shippingAddress?.phone}
// *Ordered Items:*
// ${productList}────────────────────
// 💰 Subtotal:  GHS ${order.subtotal.toFixed(2)}
// 🚚 Delivery Fee: GHS ${order.deliveryFee.toFixed(2)}
// 💲 Credit Bal.: GHS ${order.creditAppliedTotal.toFixed(2)}
// 💸 Total Amount: GHS ${order.total.toFixed(2)}
// 💳 Total Due: GHS ${(order.totalDue || order.total).toFixed(2)}
// For assistance, reach out to our support team at
//  Kwaku: 0553121737 or
//  Samira: 0241234234
// Thank you for choosing SowGreen Organic Farms! 🌱
// We look forward to serving you.`

//   return message
// }
