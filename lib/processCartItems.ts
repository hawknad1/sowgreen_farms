// import { Item } from "@/types"
// import groupById from "./groupById"
// import { getCartTotal } from "./getCartTotal"
// import { addTax } from "./addTax"

// export const processCartItems = (cart: any) => {
//   const grouped = groupById(cart)

//   return Object.keys(grouped).map((id) => {
//     const items = grouped[id]

//     // Calculate the total based on the sum of prices of each item in the group
//     const total = items.reduce((sum, item) => {
//       return sum + addTax(item.price) * item.quantity // Assuming item has price and quantity
//     }, 0)

//     // Sum the quantities to reflect the customer quantity
//     const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

//     return {
//       item: items[0], // Using the first item as representative
//       total: total.toFixed(2), // Total for this group of items
//       quantity: totalQuantity, // Total quantity of this item across all grouped entries
//     }
//   })
// }

import { Item } from "@/types"
import groupById from "./groupById"
import { getCartTotal } from "./getCartTotal"

export const processCartItems = (cart: any) => {
  const grouped = groupById(cart)
  return Object.keys(grouped).map((id) => {
    const items = grouped[id]
    return {
      item: items[0], // Using the first item as a representative
      total: getCartTotal(items),
      quantity: items.length,
    }
  })
}
