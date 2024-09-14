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
  payment: "pending" | "processing" | "success" | "failed"
  deliveryMethod: string
  shippingAddress: ShippingAddress
  products: ProductOrder[] // Change from Product[] to ProductOrder[]
}

export type Product = {
  id: string
  categoryName: string
  imageUrl: string
  price: number
  title: string
  description: string
  isInStock: string
  products?: []
  quantity: number
  discount: number
  productOrders: ProductOrder[]
}

export type Item = {
  id: string
  title: string
  imageUrl: string
  description: string
  price: number
}

export type CartItem = {
  item: Item
  quantity: number
  total: string
}

// export type ProductOrder = {
//   id: string
//   productId: string
//   orderId: string
//   quantity: number
//   quantityTotal: string
//   product: Product
//   order: Order
// }

export type ProductOrder = {
  id: string
  productId: string
  orderId: string
  quantity: number
  quantityTotal: number // Changed from string to number
  product: Product
  order: Order
}
