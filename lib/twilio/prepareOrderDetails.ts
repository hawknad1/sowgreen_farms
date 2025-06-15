// import { formatProductLine } from "./formatProductLine"
// import { truncate } from "./truncate"
// import { formatCurrency } from "../utils"
// import { Staff } from "@/types"
// import { capitalizeName } from "../capitalizeName"

// interface Product {
//   quantity: number
//   quantityTotal: number
//   available: boolean
//   weight?: number
//   unit?: string
//   product: {
//     title: string
//   }
// }

// interface ShippingAddress {
//   name: string
//   address: string
//   city: string
//   region: string
//   phone: string
//   deliveryMethod?: string
// }

// interface Order {
//   shippingAddress: ShippingAddress
//   orderNumber: string
//   deliveryDate: string
//   products: Product[]
//   total: number
//   deliveryFee: number
//   dispatchRider: {
//     fullName: string
//     phone: string
//   }
//   updatedOrderTotal: number
//   creditAppliedTotal: number
//   userWhatsappOptIn: {
//     customerPhone: string
//   }
// }

// export function prepareOrderDetails(
//   order: Order,
//   shipping: ShippingAddress,
//   maxProducts: number,
//   workers: Staff[]
// ) {
//   // Prepare worker contact info using passed workers
//   const worker_one = workers[0]
//     ? `${capitalizeName(workers[0]?.fullName?.split(" ")[0])}: ${
//         workers[0]?.phone
//       }`
//     : ""
//   const worker_two = workers[1]
//     ? `${capitalizeName(workers[1]?.fullName?.split(" ")[0])}: ${
//         workers[1]?.phone
//       }`
//     : ""

//   const deliveryMethod = (shipping?.deliveryMethod || "Pickup").trim()

//   function formatDeliveryMethod(method: string) {
//     const trimmed = method.trim()

//     if (trimmed.includes("Home Delivery")) {
//       return "Home Delivery"
//     }

//     const cleaned = trimmed.replace(/^pickup-?/i, "").trim()
//     return `PICK UP @ ${cleaned}`
//   }

//   const displayMethod = formatDeliveryMethod(deliveryMethod)
//   console.log(displayMethod, "displayMethod")

//   // 1. Base information with minimal truncation
//   const baseVariables = [
//     shipping.name?.split(" ")[0],
//     order.orderNumber,
//     // truncate(order.deliveryDate, 20),
//     order.deliveryDate?.split(",").slice(0, 2).join(","),
//     displayMethod,
//     `${shipping.address}, ${shipping.city}`,
//     order?.dispatchRider?.fullName,
//     shipping.phone,
//   ]

//   // 2. Product handling with optimized combined line
//   const allProducts = order.products
//   let productLines: string[] = []

//   if (allProducts?.length > maxProducts) {
//     const firstProducts = allProducts.slice(0, 19)
//     const remainingProducts = allProducts.slice(19)

//     productLines = [
//       ...firstProducts.map((p) => formatProductLine(p, 28)), // Increased title length
//       remainingProducts
//         .map(
//           (p) =>
//             `• ${p.quantity}x ${truncate(p.product.title, 14)} ` +
//             `${p.weight ? p.weight + p.unit : ""} - ${formatCurrency(
//               p.quantityTotal,
//               "GHS"
//             )}`
//         )
//         .join(", "), // Keep comma+space separator
//     ]
//   } else {
//     productLines = [
//       ...allProducts.map((p) => formatProductLine(p, 24)),
//       ...Array(maxProducts - allProducts.length).fill(""),
//     ]
//   }

//   // 3. Compact summary values
//   const summaryValues = [
//     formatCurrency(order.total, "GHS"),
//     formatCurrency(order.deliveryFee ?? 0, "GHS"),
//     formatCurrency(order.creditAppliedTotal, "GHS"),
//     formatCurrency(order.total + (order.deliveryFee ?? 0), "GHS"),
//     formatCurrency(order.updatedOrderTotal, "GHS"),
//   ]

//   // 4. Contact info
//   const contactValues = [` ${worker_one}`, ` ${worker_two}`]

//   return { baseVariables, productLines, summaryValues, contactValues }
// }

import { formatProductLine } from "./formatProductLine"
import { truncate } from "./truncate"
import { formatCurrency } from "../utils"
import { Staff } from "@/types"
import { capitalizeName } from "../capitalizeName"

// types/order.ts
export interface Product {
  quantity: number
  quantityTotal: number
  available: boolean
  weight?: number
  unit?: string
  product: {
    title: string
  }
}

export interface ShippingAddress {
  name: string
  address: string
  city: string
  region: string
  phone: string
  deliveryMethod?: string
}

export interface Order {
  id?: string
  shippingAddress: ShippingAddress
  orderNumber: string
  deliveryDate?: string // Made optional
  products?: Product[] // Made optional
  total: number
  deliveryFee?: number // Made optional
  dispatchRider?: {
    // Made optional
    fullName: string
    phone: string
  }
  updatedOrderTotal?: number // Made optional
  creditAppliedTotal?: number // Made optional
  userWhatsappOptIn?: {
    // Made optional
    customerPhone: string
  }
  paymentMethod?: string
  createdAt?: string | Date
}

export function prepareOrderDetails(
  order: Order,
  shipping: ShippingAddress,
  maxProducts: number,
  workers: Staff[]
) {
  // Ensure required fields with fallbacks
  const products = order.products || []
  const dispatchRider = order.dispatchRider || {
    fullName: "Not assigned",
    phone: "",
  }
  const creditAppliedTotal = order.creditAppliedTotal || 0
  const deliveryFee = order.deliveryFee || 0
  const updatedOrderTotal = order.updatedOrderTotal || 0

  // Prepare worker contact info using passed workers
  const worker_one = workers[0]
    ? `${capitalizeName(workers[0]?.fullName?.split(" ")[0])}: ${
        workers[0]?.phone
      }`
    : ""
  const worker_two = workers[1]
    ? `${capitalizeName(workers[1]?.fullName?.split(" ")[0])}: ${
        workers[1]?.phone
      }`
    : ""

  const deliveryMethod = (shipping?.deliveryMethod || "Pickup").trim()

  function formatDeliveryMethod(method: string) {
    const trimmed = method.trim()

    if (trimmed.includes("Home Delivery")) {
      return "Home Delivery"
    }

    const cleaned = trimmed.replace(/^pickup-?/i, "").trim()
    return `PICK UP @ ${cleaned}`
  }

  const displayMethod = formatDeliveryMethod(deliveryMethod)

  // 1. Base information with minimal truncation
  const baseVariables = [
    shipping.name?.split(" ")[0] || "Customer",
    order.orderNumber,
    order.deliveryDate?.split(",").slice(0, 2).join(",") || "Not specified",
    displayMethod,
    `${shipping.address}, ${shipping.city}`,
    dispatchRider.fullName,
    shipping.phone,
  ]

  // 2. Product handling with optimized combined line
  let productLines: string[] = []

  if (products.length > maxProducts) {
    const firstProducts = products.slice(0, 19)
    const remainingProducts = products.slice(19)

    productLines = [
      ...firstProducts.map((p) => formatProductLine(p, 28)),
      remainingProducts
        .map(
          (p) =>
            `• ${p.quantity}x ${truncate(p.product.title, 14)} ` +
            `${p.weight ? p.weight + p.unit : ""} - ${formatCurrency(
              p.quantityTotal,
              "GHS"
            )}`
        )
        .join(", "),
    ]
  } else {
    productLines = [
      ...products.map((p) => formatProductLine(p, 24)),
      ...Array(Math.max(0, maxProducts - products.length)).fill(""),
    ]
  }

  // 3. Compact summary values
  const summaryValues = [
    formatCurrency(order.total, "GHS"),
    formatCurrency(deliveryFee, "GHS"),
    formatCurrency(creditAppliedTotal, "GHS"),
    formatCurrency(order.total + deliveryFee, "GHS"),
    formatCurrency(updatedOrderTotal, "GHS"),
  ]

  // 4. Contact info
  const contactValues = [` ${worker_one}`, ` ${worker_two}`]

  return { baseVariables, productLines, summaryValues, contactValues }
}
