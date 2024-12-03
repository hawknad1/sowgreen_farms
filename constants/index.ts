// import { Order, Payment, Product, ShippingAddress } from "@/types"
import { formatDeliveryDate } from "@/lib/formateDeliveryDate"
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
    date: formatDeliveryDate(wednesday),
    price: `GHS ${20}`,
    value: formatDeliveryDate(wednesday),
  },
  {
    label: "Saturday Delivery",
    date: formatDeliveryDate(saturday),
    price: `GHS ${20}`,
    value: formatDeliveryDate(saturday),
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

export const cityDeliveryPrices: { [city: string]: number } = {
  "37": 45,
  Abeka: 50,
  Ablekuma: 50,
  "Ablekuma New Town": 50,
  Ablemkpe: 45,
  Aburi: 55,
  Accra: 45,
  "Accra Mall": 45,
  "Accra New Town": 45,
  Achiaman: 75,
  Achimota: 45,
  "Achimota Mall": 45,
  Adabraka: 45,
  "Adjen Kotoku": 100,
  Adenta: 45,
  Adjinganor: 45,
  Afienya: 75,
  "Airport Hills": 45,
  "Airport Residential": 45,
  "Airport West": 45,
  Akosombo: 225,
  Akropong: 75,
  Amarahia: 55,
  Amasaman: 65,
  Anyaa: 50,
  "APC Estate": 55,
  Apolonia: 75,
  "Ashale Botwe": 44,
  Ashaiman: 45,
  Ashiyie: 55,
  "Ashongman Estate": 55,
  "Asylum Down": 45,
  Awoshi: 50,
  Ayikuma: 85,
  Baatsona: 45,
  Bawaleshi: 45,
  Borteyman: 55,
  Bortianor: 60,
  Brekusu: 50,
  Bubiashie: 45,
  Bukom: 45,
  "Burma Camp": 45,
  Cantonments: 45,
  Circle: 45,
  Comet: 50,
  Danfa: 55,
  Dansoman: 50,
  "Dansoman roundabout": 50,
  Darkuman: 50,
  Dawhenya: 75,
  Dodowa: 75,
  Dome: 45,
  Dzorwulu: 45,
  "East Legon": 45,
  "East Legon hills": 55,
  Frafraha: 50,
  Gbawe: 50,
  Haatso: 45,
  "James Town": 45,
  "Junction Mall": 45,
  Kaneshie: 45,
  Kanda: 45,
  Kasoa: 75,
  Kitsase: 50,
  "Klagon (spintex)": 45,
  Kokrobite: 75,
  Kokomlemle: 45,
  Koforidua: 175,
  "Korle-Bu": 45,
  "Korle Gonna": 45,
  Kotobabi: 45,
  Kwabenya: 55,
  Kwashieman: 50,
  La: 45,
  Labadi: 45,
  "Labadi Beach": 45,
  Labone: 45,
  "Lakeside Estates": 55,
  Lapaz: 45,
  Larteh: 75,
  Lashibi: 45,
  Legon: 45,
  Madina: 45,
  Maamobi: 45,
  Makola: 45,
  Mallam: 50,
  Mamfe: 65,
  Mampong: 65,
  Mamprobi: 45,
  "Mataheko Accra": 45,
  "Mataheko Tema": 65,
  "Mile 7": 45,
  "Mile 11": 60,
  "Nmai Dzorn": 50,
  "North Dzorwulu": 45,
  "North Kaneshie": 45,
  "North Legon": 45,
  "North Ridge": 45,
  Nsawam: 95,
  Nungua: 45,
  Odorkor: 45,
  Ofankor: 45,
  Osu: 45,
  Oyarifa: 50,
  Oyibi: 60,
  "Palace Roundabout": 45,
  Pampram: 95,
  Pantang: 50,
  Pokuase: 55,
  Ridge: 45,
  Sasaabi: 60,
  Sakumono: 45,
  Sebrepor: 55,
  "Shai Hills": 75,
  Sowutoum: 50,
  "Spintex Road": 45,
  Taifa: 45,
  "Tema Comm3": 45,
  "Tema Comm4": 45,
  "Tema Comm7": 45,
  "Tema Comm9": 45,
  "Tema Comm25": 55,
  "Tema New Town": 50,
  Teshie: 45,
  "Teshie Nungua": 45,
  Tesano: 45,
  "Tse Addo": 45,
  Villaggio: 45,
  Weija: 55,
  Westlands: 45,
}

export const regions = [
  {
    name: "Accra",
  },
  {
    name: "Eastern",
  },
]
