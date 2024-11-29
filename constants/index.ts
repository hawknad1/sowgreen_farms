// import { Order, Payment, Product, ShippingAddress } from "@/types"
import { getUpcomingDeliveryDates } from "@/lib/getUpcomingDeliveryDates"
import { ShippingAddress } from "@/types"
import {
  BookmarkIcon,
  CreditCardIcon,
  TruckIcon,
} from "@heroicons/react/20/solid"
import {
  BadgeInfo,
  Bell,
  Carrot,
  CircleUser,
  Heart,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  Settings,
  Settings2,
  ShoppingCart,
  UserRound,
  Users,
} from "lucide-react"

export const menuLinks = [
  {
    id: 1,
    title: "Home",
    href: "/",
  },
  {
    id: 2,
    title: "Category",
    href: "/category",
  },
  {
    id: 3,
    title: "Sale",
    href: "/sale",
  },
  {
    id: 3,
    title: "About",
    href: "/about",
  },
  {
    id: 5,
    title: "Blog",
    href: "/blog",
  },
]

export const accordion = [
  {
    id: 1,
    value: "item-1",
    heading: "Healthy Cruciferous",
    description: "Cruciferous vegetables belong to the Brassicaceae family.",
  },
  {
    id: 2,
    value: "item-2",
    heading: "Fresh Root Vegetables",
    description: "Root vegetables like carrots, beets, and radishes.",
  },
  {
    id: 3,
    value: "item-3",
    heading: "Dry Fruits & Nuts",
    description:
      "Dry fruits and nuts are a great source of essential nutrients.",
  },
  {
    id: 4,
    value: "item-4",
    heading: "Organic Vegetables",
    description:
      "Organic vegetables are grown without the use of synthetic pesticides",
  },
  {
    id: 5,
    value: "item-5",
    heading: "Natural Citrus Fruits",
    description: "Citrus fruits are known for their high vitamin C content",
  },
  {
    id: 6,
    value: "item-6",
    heading: "Healthy Leafy Green",
    description:
      "Leafy greens like spinach, kale, and lettuce are nutrient-dense.",
  },
]

export const accountLinks = [
  { id: 1, title: "Login", href: "/sign-in" },
  { id: 2, title: "View Cart", href: "/basket" },
  { id: 3, title: "My Order", href: "/orders" },
  { id: 4, title: "Contact Us", href: "/contact" },
]

export const companyLinks = [
  { id: 1, title: "About Us", href: "/about" },
  { id: 2, title: "Privacy Policy", href: "/privacy" },
  { id: 3, title: "Terms & Conditions", href: "/terms" },
  { id: 4, title: "Careers", href: "/careers" },
]

export const helpfulLinks = [
  { id: 1, title: "Help", href: "/about" },
  { id: 2, title: "FAQs", href: "/privacy" },
  { id: 3, title: "Live Chat", href: "/terms" },
  { id: 4, title: "Refund Policy", href: "/careers" },
]

export const footerLeftLinks = [
  { id: 1, title: "Terms & Conditions", href: "/terms" },
  { id: 2, title: "Privacy Policy", href: "/privacy" },
  { id: 3, title: "Cookies", href: "/cookies" },
]

export const paymentLinks = [
  { id: 1, image: "/images/mtn.png" },
  { id: 2, image: "/images/paypal.png" },
  { id: 3, image: "/images/visa.png" },
  { id: 4, image: "/images/mastercard.png" },
]

export const socialLinks = [
  {
    title: "Twitter",
    svg: "",
    href: "",
  },
  {
    title: "Facebook",
    svg: "",
    href: "",
  },
  {
    title: "Instagram",
    svg: "",
    href: "",
  },
]

export const smallImage = [
  {
    id: 1,
    imageUrl: "/images/veg.png",
  },
  {
    id: 2,
    imageUrl: "/images/fruits.png",
  },
  {
    id: 3,
    imageUrl: "/images/seafood.png",
  },
  {
    id: 4,
    imageUrl: "/images/meat.png",
  },
]

export const orderStatusCard = [
  {
    title: "Processing",
    status: "processing",
    subTitle: "Processing Order",
    icon: CreditCardIcon,
  },
  {
    title: "Confirmed",
    status: "confirmed",
    subTitle: "Order Confirmed",
    icon: TruckIcon,
  },

  {
    title: "Shipped",
    status: "shipped",
    subTitle: "Order Shipped",
    icon: TruckIcon,
  },
  {
    title: "Completed",
    status: "delivered",
    subTitle: "Order Delivered",
    icon: Package,
  },
]

export const sidebarLinks = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: Home,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Customers",
    path: "/admin/customers",
    icon: Users,
  },
  {
    label: "Management",
    path: "/admin/management",
    icon: Users,
  },
  {
    label: "Transactions",
    path: "/admin/transactions",
    icon: LineChart,
  },
  {
    label: "Sales",
    path: "/admin/sales",
    icon: LineChart,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
  {
    label: "Help",
    path: "/admin/help",
    icon: BadgeInfo,
  },
]

const [wednesday, saturday] = getUpcomingDeliveryDates()

console.log(wednesday, "wednesday---")
console.log(saturday.toLocaleDateString("en-US"), "saturday---")

export const deliveryMethods = [
  {
    label: "Wednesday Delivery",
    tag: "",
    date: wednesday.toLocaleDateString("en-US"),
    price: `GHS ${20}`,
    value: "wednesday-delivery",
  },
  {
    label: "Saturday Delivery",
    date: saturday.toLocaleDateString("en-US"),
    price: `GHS ${20}`,
    value: "saturday-delivery",
  },
  {
    label: "Schedule a pickup",
    value: "schedule-pickup",
    pickupOptions: [
      { label: "Wednesday - DZORWULU - 11AM-5PM" },
      { label: "SATURDAY - WEB DuBOIS CENTER - 10AM-3PM" },
    ],
  },
]

export const dispatchRider = [
  {
    name: "Julius Oppong",
    value: "Julius",
  },
  {
    name: "Nana Kwame",
    value: "kwame",
  },
  {
    name: "John Doe",
    value: "john",
  },
  {
    name: "Kwaku D",
    value: "kwaku",
  },
]

export const units = [
  {
    unitTitle: "Kilogram",
    unitSign: "kg",
  },
  {
    unitTitle: "Grams",
    unitSign: "g",
  },
  {
    unitTitle: "Litre",
    unitSign: "ltr",
  },
]

export const sideMenuLinks = [
  {
    label: "Account",
    href: "/account",
    icon: UserRound,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: Carrot,
  },
  {
    label: "Wishlists",
    href: "/wishlists",
    icon: Heart,
  },
]

export const adminSideMenuLinks = [
  {
    label: "Admin Dashboard",
    href: "/admin/dashboard",
    icon: UserRound,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: Carrot,
  },
  {
    label: "Wishlists",
    href: "/wishlists",
    icon: Heart,
  },
]

export type Order = {
  id: string
  orderNumber: string
  referenceNumber: string
  total: number
  status: "processing" | "shipped" | "delivered"
  dispatchRider?: string
  deliveryMethod: string
  deliveryFee: number
  shippingAddress: ShippingAddress
  products: ProductOrder[]
  createdAt: string
}

export type ProductOrder = {
  item: {
    id: string
    title: string
    categoryName: string
    description: string
    imageUrl: string
    price: number
    weight: number
    unit: string
    isInStock: string
    discount: number
    quantity: number
    purchaseCount: number
    createdAt: string
    updatedAt: string
  }
  total: number
  quantity: number
}
// Dummy data response
export const dummyOrder: Order = {
  id: "12345",
  orderNumber: "SG-001234",
  referenceNumber: "REF-123456",
  total: 150.5,
  status: "processing",
  dispatchRider: "John Doe",
  deliveryMethod: "Standard Delivery",
  deliveryFee: 10,
  shippingAddress: {
    id: "383837373833",
    name: "Jane Doe",
    address: "123 Green St",
    email: "hdj@yahoo.com",
    city: "Accra",
    region: "Greater Accra",
    phone: "0541234567",
    country: "Ghana",
  },
  products: [
    {
      item: {
        id: "prod-1",
        title: "Organic Tomato",
        categoryName: "Vegetables",
        description: "Fresh organic tomatoes",
        imageUrl:
          "http://res.cloudinary.com/dus8qbaae/image/upload/v1730066505/ro8dlaj9tmh49fnnmxaw.png",
        price: 30,
        weight: 1,
        unit: "kg",
        isInStock: "yes",
        discount: 0,
        quantity: 10,
        purchaseCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      total: 30,
      quantity: 2,
    },
  ],
  createdAt: new Date().toISOString(),
}

export const sowgreenWorkers = [
  {
    name: "Xornam",
    phone: "0546729407",
  },
  {
    name: "Samira",
    phone: "0544437775",
  },
]
