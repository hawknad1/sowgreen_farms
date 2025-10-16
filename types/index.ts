import { PartnerType } from "@/app/(auth)/admin/(same-layout)/management/partners/PartnerForm"

export type Category = {
  id: string
  categoryName: string
  imageUrl: string
  description?: string
  href?: string
  price?: number
  discount?: number
  isInStock?: boolean
  quantity?: number
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
  whatsappOptIn?: boolean
  orders?: Order[]
  pickupLocation?: {
    id: string
    address: string
    city: string
    region: string
  }
}

export type MenuItem = {
  label: string
  href?: string // Optional for parent items
  icon?: React.ForwardRefExoticComponent<any> // Icon component (optional for sub-items)
  items?: MenuItem[] // Nested items (optional)
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

export type RepliedNote = {
  text: string
  sender: string
  timestamp: string
  read: boolean
  readAt: string
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
  subtotal: number
  totalDue?: number
  creditAppliedTotal?: number
  creditAppliedDeliveryFee?: number
  updatedOrderTotal?: number
  remainingAmount?: number
  balanceDeducted?: number
  updatedBalance?: number
  specialNotes?: string
  userWhatsappOptIn?: {
    customerPhone: string
    whatsappOptIn: boolean
    timestamp: Date
    method: "checkbox"
  }
  status: OrderStatus
  repliedNotes: RepliedNote[]
  dispatchRider: Staff
  deliveryMethod?: string
  deliveryFee: number
  deliveryDate: string
  cardType?: string
  last4Digits?: string
  paymentMode?: string
  paymentAction?: string
  shippingAddress: ShippingAddress
  items?: number
  data?: string
  whatsappOptIn?: boolean
  products: ProductOrder[] // Change from Product[] to ProductOrder[]
  createdAt: string
}

// type Order = { ...; repliedNotes: RepliedNote[] };

// export type RepliedNote = {
//   text: String
//   sender: String // e.g., "admin" or the admin's name
//   timestamp: Date
// }

export type TCategory = {
  id: string
  categoryName: string
  imageUrl: string
  link: string
  products: Product[]
}

export type ProductHistory = {
  id: string
  productId: string
  fieldChanged: string
  oldValue: string | null
  newValue: string | null
  changedBy: string
  changeNote?: string
  createdAt: string
}

// types/index.ts
// export interface Product {
//   id: string
//   title: string
//   slug: string
//   imageUrl: string
//   images?: { url: string; publicId: string }[]
//   description: string
//   discount?: number
//   price?: number // Add this
//   weight?: number
//   unit?: string
//   categoryName: string
//   category?: Category
//   isInStock: "in-stock" | "out-of-stock" // Fix this type
//   quantity: number
//   createdAt: string
//   updatedAt: string
//   productOrders: any[]
//   wishLists: any[]
//   purchaseCount: number
//   variants: ProductVariant[]
//   partnerId?: string
//   partner?: PartnerType | null
//   priceHistory: any[]
// }

export type Product = {
  categoryName: string
  createdAt: string
  images?: { url: string; publicId: string }[]
  description: string
  discount: number
  id: string
  slug: string
  imageUrl: string
  isInStock: string
  purchaseCount: number
  quantity: number
  title: string
  updatedAt: string
  variants: Variant[]
  wishLists: any[]
  rating?: number // Added as optional since it's used in sorting
  partner?: PartnerType | null // Match Prisma model
  productHistory: ProductHistory[]
  priceHistory: any[]
}

export interface ProductVariant {
  id: string // Add this
  productId: string
  product?: Product
  weight?: number
  price: number
  discountedPrice?: number
  unit?: string
  createdAt: string
  updatedAt: string
  priceHistory: any[]
}

// export type Product = {
//   categoryName: string
//   createdAt: string
//   images?: { url: string; publicId: string }[]
//   description: string
//   discount: number
//   id: string
//   slug: string
//   imageUrl: string
//   isInStock: string
//   purchaseCount: number
//   quantity: number
//   title: string
//   updatedAt: string
//   variants: Variant[]
//   rating?: number // Added as optional since it's used in sorting
//   partner?: PartnerType | null // Match Prisma model
// }

export type Variant = {
  id: string
  productId: string
  weight: number
  price: number
  unit: string
  discountedPrice?: number
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
  user: {
    id: string
    name?: string
    email?: string
    balance?: number
    orders?: Order[]
    role: string
    image?: string | null
    createdAt: string
    updatedAt: string
    emailVerified?: string | null
    phone?: string | null
  }
}

export type UserDetailType = {
  id: string
  name?: string
  email?: string
  balance?: number
  orders?: Order[]
  role: string
  image?: string | null
  createdAt: string
  updatedAt: string
  emailVerified?: string | null
  phone?: string | null
}

export type UserProps = {
  id?: string
  name?: string
  phone?: string
  email?: string
  birthdate?: Date
  role?: string
  emailVerified?: boolean
  image?: string
  balance?: number
  onUpdateSession?: () => void
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
  orders?: Order
}

export type Staff = {
  id?: string
  fullName: string
  phone: string
  jobTitle?: string
  role?: string
  email?: string
}

export type Location = {
  id: string
  region: string
  city: string
  address: string
}

// types/index.ts
export interface PriceHistory {
  id: string
  productId: string
  product?: {
    title: string
    slug: string
  }
  oldPrice: number | null
  newPrice: number
  changedBy: string
  changedById?: string
  changeNote?: string
  createdAt: string
}

export interface VariantPriceHistory {
  id: string
  variantId: string
  variant?: {
    weight?: number
    unit?: string
  }
  oldPrice: number | null
  newPrice: number
  oldDiscounted?: number | null
  newDiscounted?: number | null
  changedBy: string
  changedById?: string
  changeNote?: string
  createdAt: string
}
