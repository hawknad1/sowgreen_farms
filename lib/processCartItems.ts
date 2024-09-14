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
