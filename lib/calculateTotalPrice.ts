type CartItem = {
  productId: string // ID of the product
  variantId: string // ID of the selected variant
  title: string // Title of the product
  quantity: number // Quantity of the selected variant
  price: number // Price of the selected variant
  weight: number // Weight of the selected variant
  unit: string // Unit of the selected variant
}

export function calculateTotalPrice(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}
