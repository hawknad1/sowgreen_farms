export type Category = {
  id: string
  categoryName: string
  imageUrl: string
  description: string
  href: string
  price: number
  discount: number
  isInStock: boolean
  quantity: number
}

export type Payment = {
  id: string
  orderNumber: string
  referenceNumber: string
  total: number
  payment: "pending" | "processing" | "success" | "failed"
  deliveryMethod: string
  shippingAddress: ShippingAddress
  products: Product[]
}

export type ShippingAddress = {
  id: string
  name: string
  email: string
  address: string
  city: string
  region: string
  country: string
  phone: string
  deliveryMethod?: string
  orders?: Order[]
}

export type CustomerDetailType = {
  id: string
  name: string
  city: string
  region: string
  address: string
  phone: string
  deliveryMethod: string
  orders?: Order[]
}

export type OrderStatus =
  | "processing"
  | "confirmed"
  | "in-transit"
  | "delivered"
  | "cancelled"

export type Order = {
  id: string
  orderNumber: string
  referenceNumber: string
  total: number
  status: OrderStatus
  dispatchRider: string
  deliveryMethod?: string
  deliveryFee: number
  deliveryDate: string
  cardType?: string
  last4Digits?: string
  paymentMode?: string
  paymentAction?: string
  shippingAddress: ShippingAddress
  products: ProductOrder[] // Change from Product[] to ProductOrder[]
  createdAt: string
}

export type TCategory = {
  id: string
  categoryName: string
  imageUrl: string
  link: string
  products: Product[]
}

export type Product = {
  categoryName: string
  createdAt: string
  images?: { url: string; publicId: string }[]
  description: string
  discount: number
  id: string
  imageUrl: string
  isInStock: string
  purchaseCount: number
  quantity: number
  title: string
  updatedAt: string
  variants: Variant[]
}

export type Variant = {
  id: string
  productId: string
  weight: number
  price: number
  unit: string
}

export type PaymentInfo = {
  cardType: string
  last4Digits: string
  paymentMode: string
  paymentAction: string
  status?: string
}

export type WeightPrice = {
  id: string
  weight: number
  price: number
  product: Product
  productId: string
}

export type Item = {
  id: string
  title: string
  imageUrl: string
  description: string
  price: number
}

export type CreditRequestBody = {
  email?: string
  phone?: string
  amount: number
}

export type CartItem = {
  item: Item
  quantity: number
  total: string
}

export type VariantCartItem = {
  productId: string // ID of the product
  variantId: string // ID of the selected variant
  product: Product
  title: string // Title of the product (optional for convenience)
  quantity: number // Quantity of the selected variant
  price: number // Price of the selected variant
  weight: number // Weight of the selected variant
  unit: string // Unit of the selected variant
}

export type Cart = {
  items: CartItem[] // List of items in the cart
  totalPrice: number // Total price of the cart
}

export type ProductOrder = {
  id: string
  productId: string
  orderId: string
  quantity?: number
  available?: boolean
  quantityTotal?: string // Changed from string to number
  product: Product
  price: number
  weight: number
  unit: string
  order?: Order
}

export type User = {
  id: string
  name: string
  role: string
  balance: number
  email: string
}

export type CitiesWithFees = {
  id: string
  city: string
  deliveryFee: number
  region: string
}

export type DispatchRider = {
  id: string
  gender: string
  firstName: string
  lastName: string
  phone: string
}

// export type PaymentAction = {

// }
