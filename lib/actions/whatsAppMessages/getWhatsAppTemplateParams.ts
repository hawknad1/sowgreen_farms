// import { sowgreenWorkers } from "@/constants"
// import { Order } from "@/types"

// type TemplateParams = {
//   customerName: string
//   deliveryDate: string
//   orderNumber: string
//   deliveryMethod: string
//   address: string
//   products: string[]
//   deliveryFee: number
//   total: number
// }

// export function getWhatsAppTemplateParams(order: Order): TemplateParams {
//   const name = order?.shippingAddress?.name || "Customer"
//   const orderNumber = order?.orderNumber || "N/A"
//   const deliveryDate = order?.deliveryDate || "Not specified"
//   const deliveryMethod =
//     order?.shippingAddress?.deliveryMethod || "Not specified"
//   const deliveryAddress = `${order?.shippingAddress?.address}, ${order?.shippingAddress?.city}`

//   // Generate order summary
//   const orderSummary = order.products
//     .map(({ product, quantity, weight, unit, price, available }) => {
//       if (!product || available === false) return null

//       const formattedWeight = weight
//         ? `${weight < 1 ? weight * 1000 : weight}${unit || ""}`
//         : "N/A"

//       return `${formattedWeight} ${
//         product.title
//       } (QTY :${quantity}) GHC ${price.toFixed(2)}`
//     })
//     .filter(Boolean)
//     .join("\n")

//   const deliveryFee = order?.deliveryFee || 0
//   const total = (order?.total || 0) + deliveryFee

//   // Example contact list
//   const contact1 = sowgreenWorkers[0]
//     ? `${sowgreenWorkers[0].name} - ${sowgreenWorkers[0].phone}`
//     : "Contact 1"
//   const contact2 = sowgreenWorkers[1]
//     ? `${sowgreenWorkers[1].name} - ${sowgreenWorkers[1].phone}`
//     : "Contact 2"

//   return [
//     name, // {{1}}
//     orderNumber, // {{2}}
//     deliveryDate, // {{3}}
//     deliveryMethod, // {{4}}
//     deliveryAddress, // {{5}}
//     contact1, // {{6}}
//     orderSummary, // {{7}}
//     `GHS ${deliveryFee.toFixed(2)}`, // {{8}}
//     `GHS ${total.toFixed(2)}`, // {{9}}
//     contact2, // {{10}}
//   ]
// }
