// export interface Product {
//   category: string
//   url: string
//   prices: number
//   title: string
//   images: string
//   currency: string
//   warranty: string
//   _warnings: string
//   breadcrumbs: string
//   description: string
//   out_of_stock: boolean
// }

export type TCategory = {
  id: string
  categoryName: string
  imageUrl: string
  link: string
}

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
  orders?: Order[]
}

// export type Order = {
//   id: string
//   orderNumber: string
//   referenceNumber: string
//   total: number
//   payment: "pending" | "processing" | "success" | "failed"
//   deliveryMethod: string
//   shippingAddress: ShippingAddress
//   products: Product[]
// }

export type Order = {
  id: string
  orderNumber: string
  referenceNumber: string
  total: number
  status: "processing" | "shipped" | "delivered"
  dispatchRider: string
  deliveryMethod: string
  deliveryFee: number
  cardType?: string
  last4Digits?: string
  paymentMode?: string
  paymentAction?: string
  shippingAddress: ShippingAddress
  products: ProductOrder[] // Change from Product[] to ProductOrder[]
  createdAt: string
}

export type Product = {
  id: string
  categoryName: string
  imageUrl: string
  images: { url: string; publicId: string }[]
  price: number
  title: string
  description: string
  isInStock: string
  purchaseCount: number
  products?: []
  quantity: number
  discount: number
  productOrders: ProductOrder[]
  weight: number
  unit: string

  // weightsAndPrices: { price: number; weight: number }[]
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

// export type CartItem = {
//   id: string
//   item: Product // The Product type definition
//   total: string
//   quantity: number
//   weight: number
//   categoryName: string
//   imageUrl: string
//   price: number
//   // other necessary fields
// }

export type CartItem = {
  item: Item
  quantity: number
  total: string
}
// export interface CartItem extends Product {
//   weight: number // Assuming weight is not part of Product and is specific to CartItem
// }

export type ProductOrder = {
  id: string
  productId: string
  orderId: string
  quantity: number
  quantityTotal: string // Changed from string to number
  product: Product
  weight?: number
  order: Order
}

export type User = {
  id: string
  name: string
  role: string
  balance: number
  email: string
}
