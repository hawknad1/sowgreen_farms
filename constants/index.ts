// import { Order, Payment, Product, ShippingAddress } from "@/types"
import { formatDeliveryDate } from "@/lib/formateDeliveryDate"
import { getUpcomingDeliveryDates } from "@/lib/getUpcomingDeliveryDates"
import { formatCurrency } from "@/lib/utils"
import { MenuItem, ShippingAddress } from "@/types"
import {
  BookmarkIcon,
  CreditCardIcon,
  TruckIcon,
} from "@heroicons/react/20/solid"
import {
  BadgeInfo,
  Bell,
  Cherry,
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
  PackageCheck,
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Contact,
  Map,
  PieChart,
  Send,
  SquareTerminal,
  NotebookPenIcon,
  Salad,
  ListOrdered,
  LayoutDashboard,
  MessageSquareCode,
  MessageSquare,
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
  { id: 2, image: "/images/telecel1.jpg" },
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
    icon: PackageCheck,
  },

  {
    title: "In Transit",
    status: "in-transit",
    subTitle: "On The Way",
    icon: TruckIcon,
  },
  {
    title: "Completed",
    status: "delivered",
    subTitle: "Order Delivered",
    icon: Package,
  },
]

export const [wednesday, saturday] = getUpcomingDeliveryDates()

export const sidebarLinks = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingCart,
      items: [
        {
          title: "Confirmed",
          url: "/admin/orders/confirmed",
        },
        {
          title: "In Transit",
          url: "/admin/orders/in-transit",
        },
        {
          title: "Delivered",
          url: "/admin/orders/delivered",
        },
      ],
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: Cherry,
      items: [
        {
          title: "Vegetables",
          url: "/admin/products/vegetables",
        },
        {
          title: "Fruits",
          url: "/admin/products/fruits",
        },
        {
          title: "Beverages",
          url: "/admin/products/beverages",
        },
        {
          title: "Meat & Poultry",
          url: "/admin/products/meat-poultry",
        },
        {
          title: "Processed Meats",
          url: "/admin/products/processed-meat",
        },
        {
          title: "Fat & Oils",
          url: "/admin/products/fat-oils",
        },
        {
          title: "Spicies & Herbs",
          url: "/admin/products/spicies-herbs",
        },
        {
          title: "Seafoods",
          url: "/admin/products/seafoods",
        },
        {
          title: "Nuts",
          url: "/admin/products/nuts",
        },
        {
          title: "Preservatives",
          url: "/admin/products/preservatives",
        },
        {
          title: "Farming Supplies",
          url: "/admin/products/farming-supplies",
        },
        {
          title: "Seeds & Seedlings",
          url: "/admin/products/seeds-seedlings",
        },
        {
          title: "Ice Cream & Sorbets",
          url: "/admin/products/ice-cream-sorbets",
        },
        {
          title: "Sauces & Condiments",
          url: "/admin/products/sauces-condiments",
        },
        {
          title: "Other",
          url: "/admin/products/other",
        },
      ],
    },
    {
      title: "Management",
      url: "/admin/management/staff",
      icon: Users,
      items: [
        {
          title: "Staff",
          url: "/admin/management/staff",
        },
        // {
        //   title: "Groups",
        //   url: "/admin/management/groups/farm",
        // },
        {
          title: "Pickup Locations",
          url: "/admin/management/pickup-locations",
        },
        {
          title: "Route Sheets",
          url: "/admin/route-sheets",
        },
        {
          title: "City List",
          url: "/admin/city-list",
        },
        {
          title: "Dispatch Riders",
          url: "/admin/dispatch-riders",
        },
        {
          title: "Official Partners",
          url: "/admin/management/partners",
        },
        // {
        //   title: "Broadcast Message",
        //   url: "/admin/broadcast-message",
        // },
      ],
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: Contact,
    },
    {
      title: "Transactions",
      url: "/admin/transactions",
      icon: LineChart,
    },

    // {
    //   title: "Settings",
    //   url: "/admin/settings",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/admin/help",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "",
      icon: Send,
    },
  ],
}

export const deliveryMethods = [
  {
    label: "Home Delivery",
    tag: "",
    date: formatDeliveryDate(wednesday),
    price: `GHS ${20}`,
    value: `Home Delivery - ${formatDeliveryDate(wednesday)}`,
  },
  {
    label: "Home Delivery",
    date: formatDeliveryDate(saturday),
    price: `GHS ${20}`,
    value: `Home Delivery - ${formatDeliveryDate(saturday)}`,
  },
  {
    label: "Schedule a pickup",
    value: "schedule-pickup",
    pickupOptions: [
      {
        label: "Wednesday - DZORWULU - 11AM-5PM",
        date: formatDeliveryDate(wednesday),
      },
      {
        label: "SATURDAY - WEB DuBOIS CENTER - 10AM-3PM",
        date: formatDeliveryDate(saturday),
      },
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
    unitTitle: "Milliliters",
    unitSign: "ml",
  },
  {
    unitTitle: "Litre",
    unitSign: "ltr",
  },
]

export const getSideMenuLinks = (balance: number): MenuItem[] => {
  const baseLinks: MenuItem[] = [
    {
      label: "Account",
      icon: UserRound,
      items: [
        {
          label: "Profile",
          href: "/account/profile",
          icon: UserRound, // Add individual icons for sub-items if needed
        },
        {
          label: "Order History",
          href: "/account/order-history",
          icon: ListOrdered, // Add individual icons for sub-items if needed
        },
      ],
    },
    {
      label: "Products",
      href: "/products",
      icon: Salad,
    },
    {
      label: "Wishlists",
      href: "/wishlists",
      icon: Heart,
    },
  ]

  // Add a new menu item if the balance is greater than 0
  baseLinks.push({
    label: `Credit Balance : ${formatCurrency(balance, "GHS")}`,
    href: "",
    icon: Settings, // Use an appropriate icon
  })

  return baseLinks
}

export const getAdminSideMenuLinks = (balance: number): MenuItem[] => {
  const baseLinks: MenuItem[] = [
    {
      label: "Account",
      icon: UserRound,
      items: [
        {
          label: "Profile",
          href: "/account/profile",
          icon: UserRound,
        },
        {
          label: "Order History",
          href: "/account/order-history",
          icon: ListOrdered,
        },
        {
          label: "Admin Dashboard",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: "Products",
      href: "/products",
      icon: Salad,
    },
    {
      label: "Wishlists",
      href: "/wishlists",
      icon: Heart,
    },
  ]

  // Add a new menu item if the balance is greater than 0
  baseLinks.push({
    label: `Credit Balance : ${formatCurrency(balance, "GHS")}`,
    href: "",
    icon: CreditCardIcon, // Use an appropriate icon
  })

  return baseLinks
}

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
  Teiman: 55,
  "Tse Addo": 45,
  Villaggio: 45,
  Weija: 55,
  Westlands: 45,
}

export const regions = [
  {
    name: "Greater Accra",
  },
  {
    name: "Eastern",
  },
  {
    name: "Central",
  },
]

export const staffRole = [
  { id: "1", label: "Manager", value: "manager" },
  {
    id: "2",
    label: "Admin",
    value: "admin",
  },
  { id: "3", label: "Staff", value: "staff" },
]

export const jobTitle = [
  { id: "1", label: "Sales Manager", value: "sales manager" },
  {
    id: "2",
    label: "Support Staff",
    value: "support staff",
  },
  { id: "3", label: "Dispatch Rider", value: "dispatch rider" },
  { id: "4", label: "Cleaner", value: "cleaner" },
  { id: "5", label: "Inventory", value: "inventory" },
]

export const gender = [
  {
    name: "Male",
  },
  {
    name: "Female",
  },
]

export const newDeliveryMethod = [
  { value: "Home Delivery" },
  { value: "DZORWULU" },
  { value: "WEB DuBOIS CENTER" },
  { value: "PARKS & GARDENS" },
]

export const deliveryDates = [
  {
    date: formatDeliveryDate(wednesday),
  },
  {
    date: formatDeliveryDate(saturday),
  },
]

export const paymentActionList = [
  {
    title: "Paid",
    value: "paid",
  },
  {
    title: "Pending",
    value: "pending",
  },
]

export const status = [
  { title: "Processing", value: "processing" },
  { title: "Confirmed", value: "confirmed" },
  { title: "In Transit", value: "in-transit" },
  { title: "Delivered", value: "delivered" },
  { title: "Cancelled", value: "cancelled" },
]
