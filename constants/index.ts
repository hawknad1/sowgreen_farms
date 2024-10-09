import { Payment, Product } from "@/types"
import {
  BookmarkIcon,
  CreditCardIcon,
  TruckIcon,
} from "@heroicons/react/20/solid"
import {
  BadgeInfo,
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  Settings,
  ShoppingCart,
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
    title: "Order Paid",
    status: "",
    subTitle: "Customer Payment",
    icon: CreditCardIcon,
  },
  {
    title: "Order Processing",
    status: "processing",
    subTitle: "Processing Order",
    icon: CreditCardIcon,
  },
  {
    title: "Order Shipped",
    status: "shipped",
    subTitle: "On Delivery",
    icon: TruckIcon,
  },
  {
    title: "Order Completed",
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

export const deliveryMethods = [
  {
    label: "Same Day Delivery",
    tag: "(Order before 10AM)",
    price: `GHS ${20}`,
    value: "same-day-delivery",
  },
  {
    label: "Next Day Delivery",
    date: "",
    price: `GHS ${20}`,
    value: "next-day-delivery",
  },
  {
    label: "Schedule a pickup",
    value: "schedule-pickup",
    pickupOptions: [
      { label: "Wednesday - DZORWULU - 11AM-5PM" },
      { label: "SATURDAY - WEB DuBOIS CENTER - CANTONMENTS - 10AM-3PM" },
    ],
  },
]

export const dispatchRider = [
  {
    name: "Julius Oppong",
    value: "julius",
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
