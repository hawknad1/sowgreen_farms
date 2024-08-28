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

export type Order = {
  id: string
  orderNumber: string
  referenceNumber: string
  total: number
  payment: "pending" | "processing" | "success" | "failed"
  deliveryMethod: string
  shippingAddress: ShippingAddress
  products: Product[]
}

export type Product = {
  id: string
  categoryName: string
  imageUrl: string
  price: number
  title: string
  description: string
  inStock: boolean
  products: []
}
