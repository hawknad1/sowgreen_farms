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
    title: "Shop",
    href: "/shop",
  },
  {
    id: 3,
    title: "Category",
    href: "/category",
  },
  {
    id: 4,
    title: "Sale",
    href: "/sale",
  },
  {
    id: 4,
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
  { id: 1, title: "Login", href: "/login" },
  { id: 2, title: "View Cart", href: "/cart" },
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
    title: "Order Made",
    subTitle: "Order Created",
    icon: BookmarkIcon,
  },
  {
    title: "Order Paid",
    subTitle: "Customer Payment",
    icon: CreditCardIcon,
  },
  {
    title: "Order Shipped",
    subTitle: "On Delivery",
    icon: TruckIcon,
  },
  {
    title: "Order Completed",
    subTitle: "Order Delivered",
    icon: Package,
  },
]

export const sidebarLinks = [
  {
    label: "Dashboard",
    path: "/account/admin/dashboard",
    icon: Home,
  },
  {
    label: "Orders",
    path: "/account/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Products",
    path: "/account/admin/products",
    icon: Package,
  },
  {
    label: "Customers",
    path: "/account/admin/customers",
    icon: Users,
  },
  {
    label: "Management",
    path: "/account/admin/management",
    icon: Users,
  },
  {
    label: "Transactions",
    path: "/account/admin/transactions",
    icon: LineChart,
  },
  {
    label: "Sales",
    path: "/account/admin/sales",
    icon: LineChart,
  },
  {
    label: "Settings",
    path: "/account/admin/settings",
    icon: Settings,
  },
  {
    label: "Help",
    path: "/account/admin/help",
    icon: BadgeInfo,
  },
]


// export const productData: Product[] = [
//   {
//     id: "m5gr84i9",
//     title: "Banana",
//     categoryName: "Fruits",
//     description: "I love fruits",
//     price: 5.0,
//     isInStock: "in-stock",
//     imageUrl: "",
//     products: [],
//   },
//   {
//     id: "m5gr84i9",
//     title: "Maize",
//     categoryName: "Cereals",
//     description: "hey there",
//     price: 55.0,
//     isInStock: "in-stock",
//     imageUrl: "",
//     products: [],
//   },
//   {
//     id: "m5gr84i9",
//     title: "Onion",
//     categoryName: "Vegetables",
//     description: "hey there",
//     price: 23.0,
//     isInStock: "in-stock",
//     imageUrl: "",
//     products: [],
//   },
//   {
//     id: "m5gr84i9",
//     title: "Rabbit Meat",
//     categoryName: "Meat",
//     description: "hey there",
//     price: 55.0,
//     isInStock: "in-stock",
//     imageUrl: "",
//     products: [],
//   },
//   {
//     id: "m5gr84i9",
//     title: "Milk",
//     categoryName: "Dairy",
//     description: "hey there",
//     price: 51.0,
//     isInStock: "in-stock",
//     imageUrl: "",
//     products: [],
//   },
//   {
//     id: "m5gr84i9",
//     title: "Drink",
//     categoryName: "Beverages",
//     description: "hey there",
//     price: 51.0,
//     isInStock: "in-stock",
//     imageUrl: "",
//     products: [],
//   },
//   {
//     id: "m5gr84i9",
//     title: "Watermelon",
//     categoryName: "Fruits",
//     price: 55.0,
//     description: "hey there",
//     isInStock: "in-stock",
//     imageUrl: "",
//     products: [],
//   },
// ]
