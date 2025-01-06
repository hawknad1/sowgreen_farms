import { calculateTotalPrice } from "./calculateTotalPrice"

export type Variant = {
  id: string // ID of the variant
  price: number // Price of the variant
  weight: number // Weight of the variant
  unit: string // Unit of the variant (e.g., kg, g)
}

export type Product = {
  id: string // ID of the product
  title: string // Title of the product
  imageUrl: string // URL of the product's image
  description?: string // Description of the product (optional)
  discount?: number // Discount on the product (optional)
  categoryName?: string // Category name of the product (optional)
  isInStock: boolean // Stock availability
  quantity: number // Quantity available
  variants: Variant[] // List of variants for the product
}

export type CartItem = {
  productId: string // ID of the product
  variantId: string // ID of the selected variant
  title: string // Title of the product
  quantity: number // Quantity of the selected variant
  price: number // Price of the selected variant
  weight: number // Weight of the selected variant
  unit: string // Unit of the selected variant
}

export type Cart = {
  items: CartItem[] // List of items in the cart
  totalPrice: number // Total price of the cart
}

export function addVariantsToCart(
  cart: Cart,
  product: Product,
  variantId: string,
  quantity: number
): Cart {
  const variant = product.variants.find((v) => v.id === variantId)
  if (!variant) return cart // Variant not found

  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId === product.id && item.variantId === variantId
  )

  if (existingItemIndex !== -1) {
    // Update quantity for existing item
    cart.items[existingItemIndex].quantity += quantity
  } else {
    // Add new item to the cart
    cart.items.push({
      productId: product.id,
      variantId: variant.id,
      title: product.title,
      quantity,
      price: variant.price,
      weight: variant.weight,
      unit: variant.unit,
    })
  }

  // Recalculate total price
  cart.totalPrice = calculateTotalPrice(cart.items)

  return cart
}
