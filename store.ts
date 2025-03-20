import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"
import { DispatchRider, Order, Product, ShippingAddress, User } from "./types"
import { UserDetailType } from "./app/(auth)/admin/(same-layout)/customers/page"
// import { CartItem } from "@/types"

interface PaymentStore {
  reference: any
  setReference: (reference: any) => void
}

interface ProductPriceStore {
  price: number
  setPrice: (price: number) => void
}

interface CustomerState {
  customerDetails: any //
  setCustomerDetails: (details: any) => void
}

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
  setProductDetails: (details: Product[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

interface OrdersStore {
  orders: Order[]
  loading: boolean
  error: string | null
  setOrderDetails: (details: Order[]) => void
  setOrderLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

interface AddressStore {
  customers: ShippingAddress[]
  loading: boolean
  error: string | null
  setCustomerDetails: (details: ShippingAddress[]) => void
  setCustomerLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

interface DeliveryStore {
  deliveryFee: number
  setDeliveryFee: (fee: number) => void
}

type DateRange = [Date | null, Date | null]

interface DatePickerStore {
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
}

interface TaxState {
  subtotal: number
  total: number
  calculateTax: () => void
  setSubtotal: (value: number) => void
}

interface OrderDataState {
  ordersData: {
    products: any[]
    shippingAddress: Record<string, any>
    orderNumber: string
    deliveryMethod: string
    deliveryDate: string
    updatedOrderTotal: number
    updatedBalance: number
    referenceNumber: string
    total: number
    creditAppliedTotal?: number
    creditAppliedDeliveryFee?: number
  } | null
  setOrdersData: (data: any) => void
}

interface VariantState {
  selectedVariant: {
    price: number | null
    weight: number | null
    unit: string | ""
    discountedPrice?: number | null
  }
  setSelectedVariant: (price: number, weight: number, unit: string) => void
}

type Variant = {
  id: string
  weight: number
  unit: string
  price: number
  discountedPrice?: number
}

type CartItem = {
  variantId: string
  productId: string
  product: Product
  weight: number
  price: number
  unit: string
  quantity: number
}

type CartState = {
  selectedVariant: Variant | null
  quantity: number
  cart: CartItem[]
  cartTotal: number // Total accumulation of quantityTotal for all items
  cartItemCount: number // Total count of all items in the cart
  setSelectedVariant: (variant: Variant) => void
  setQuantity: (quantity: number) => void
  addToCart: (item: CartItem) => void
  updateCartItem: (variantId: string, quantity: number) => void
  removeFromCart: (variantId: string) => void
  clearCart: () => void
  cartProducts: Record<string, Product>
  setCartProducts: (products: Record<string, Product>) => void
  updateCartTotals: () => void
}

type DispatchRidersStore = {
  dispatchRiders: DispatchRider[]
  fetchDispatchRiders: () => Promise<void>
}

export const useDispatchRidersStore = create<DispatchRidersStore>((set) => ({
  dispatchRiders: [],
  fetchDispatchRiders: async () => {
    try {
      const res = await fetch("/api/dispatch-riders", {
        method: "GET",
        cache: "no-store",
      })

      if (res.ok) {
        const riders = await res.json()
        set({ dispatchRiders: riders })
      }
    } catch (error) {
      console.error("Error fetching dispatch riders:", error)
    }
  },
}))

// export const useCartStore = create<CartState>()(
//   persist(
//     (set, get) => ({
//       selectedVariant: null,
//       quantity: 1,
//       cart: [],
//       cartTotal: 0, // Initialize total to 0
//       cartItemCount: 0, // Initialize count to 0
//       cartProducts: {},

//       setSelectedVariant: (variant) =>
//         set(() => ({ selectedVariant: variant })),
//       setQuantity: (quantity) => set(() => ({ quantity })),

//       addToCart: (item) =>
//         set((state) => {
//           const updatedCart = [...state.cart, item]
//           const updatedTotal = updatedCart.reduce(
//             (acc, cartItem) => acc + cartItem.price * cartItem.quantity,
//             0
//           )
//           const updatedItemCount = updatedCart.reduce(
//             (acc, cartItem) => acc + cartItem.quantity,
//             0
//           )
//           return {
//             cart: updatedCart,
//             cartTotal: updatedTotal,
//             cartItemCount: updatedItemCount,
//           }
//         }),

//       updateCartItem: (variantId, quantity) =>
//         set((state) => {
//           const updatedCart = state.cart.map((item) =>
//             item.variantId === variantId
//               ? { ...item, quantity: Math.max(0, item.quantity + quantity) }
//               : item
//           )
//           const updatedTotal = updatedCart.reduce(
//             (acc, cartItem) => acc + cartItem.price * cartItem.quantity,
//             0
//           )
//           const updatedItemCount = updatedCart.reduce(
//             (acc, cartItem) => acc + cartItem.quantity,
//             0
//           )
//           return {
//             cart: updatedCart,
//             cartTotal: updatedTotal,
//             cartItemCount: updatedItemCount,
//           }
//         }),

//       removeFromCart: (variantId) =>
//         set((state) => {
//           const updatedCart = state.cart.filter(
//             (item) => item.variantId !== variantId
//           )
//           const updatedTotal = updatedCart.reduce(
//             (acc, cartItem) => acc + cartItem.price * cartItem.quantity,
//             0
//           )
//           const updatedItemCount = updatedCart.reduce(
//             (acc, cartItem) => acc + cartItem.quantity,
//             0
//           )
//           return {
//             cart: updatedCart,
//             cartTotal: updatedTotal,
//             cartItemCount: updatedItemCount,
//           }
//         }),

//       clearCart: () =>
//         set(() => ({
//           cart: [],
//           cartTotal: 0, // Reset total to 0 when cart is cleared
//           cartItemCount: 0, // Reset item count to 0
//         })),
//       setCartProducts: (products) =>
//         set((state) => ({
//           cartProducts: { ...state.cartProducts, ...products },
//         })),
//     }),
//     {
//       name: "cart-storage", // Name of the localStorage key
//       partialize: (state) => ({
//         cart: state.cart,
//         cartTotal: state.cartTotal,
//         cartItemCount: state.cartItemCount, // Persist cart item count
//       }),
//     }
//   )
// )

interface CheckoutFormValues {
  name: string
  email: string
  address: string
  city: string
  country: string
  phone: string
  region: string
}

interface CheckoutStore {
  formValues: CheckoutFormValues
  setFormValues: (values: Partial<CheckoutFormValues>) => void
  resetFormValues: () => void
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      formValues: {
        name: "",
        email: "",
        address: "",
        city: "",
        country: "",
        phone: "",
        region: "",
      },
      setFormValues: (values) =>
        set((state) => ({ formValues: { ...state.formValues, ...values } })),
      resetFormValues: () =>
        set({
          formValues: {
            name: "",
            email: "",
            address: "",
            city: "",
            country: "",
            phone: "",
            region: "",
          },
        }),
    }),
    {
      name: "checkout-store", // Unique name for the localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
)

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      selectedVariant: null,
      quantity: 1,
      cart: [],
      cartTotal: 0,
      cartItemCount: 0,
      cartProducts: {},

      // Actions
      setSelectedVariant: (variant) => set({ selectedVariant: variant }),
      setQuantity: (quantity) => set({ quantity }),

      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cart.find(
            (i) => i.variantId === item.variantId
          )

          // Update quantity if item exists
          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }

          // Add new item
          return { cart: [...state.cart, item] }
        })
        get().updateCartTotals()
      },

      updateCartItem: (variantId, quantity) => {
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.variantId === variantId
                ? { ...item, quantity: Math.max(0, item.quantity + quantity) }
                : item
            )
            .filter((item) => item.quantity > 0), // Remove items with 0 quantity
        }))
        get().updateCartTotals()
      },

      removeFromCart: (variantId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.variantId !== variantId),
        }))
        get().updateCartTotals()
      },

      clearCart: () => set({ cart: [], cartTotal: 0, cartItemCount: 0 }),

      setCartProducts: (products) => {
        set((state) => ({
          cartProducts: { ...state.cartProducts, ...products },
        }))
      },

      // Helper to update totals
      updateCartTotals: () => {
        const { cart } = get()
        const cartTotal = cart.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        )
        const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0)
        set({ cartTotal, cartItemCount })
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        cart: state.cart,
        cartProducts: state.cartProducts, // Added cartProducts to persistence
        cartTotal: state.cartTotal,
        cartItemCount: state.cartItemCount,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.updateCartTotals()
        }
      },
    }
  )
)

export const useCartTotalStore = create<{
  cart: CartItem[]
  setCart: (cart: CartItem[]) => void
}>((set) => ({
  cart: [],
  setCart: (cart) => set({ cart }),
}))

export const usePaymentStore = create<PaymentStore>((set) => ({
  reference: null,
  setReference: (reference) => set({ reference }),
}))

export const useOrderDataStore = create(
  persist<OrderDataState>(
    (set) => ({
      ordersData: null,
      setOrdersData: (data) => set(() => ({ ordersData: data })),
    }),
    {
      name: "orders-storage", // name of the item in storage
      getStorage: () => localStorage, // (optional) by default the storage is localStorage
    }
  )
)

export const useTaxStore = create<TaxState>((set, get) => ({
  subtotal: 0,
  total: 0,

  setSubtotal: (value: number) => set({ subtotal: value }),

  calculateTax: () => {
    const { subtotal } = get()

    const taxRates = {
      getFund: 2.5 / 100,
      nhil: 2.5 / 100,
      covid: 1 / 100,
      vat: 15 / 100,
    }

    const calculateTax = (rate: number) => rate * subtotal

    const getFund = calculateTax(taxRates.getFund)
    const nhil = calculateTax(taxRates.nhil)
    const covid = calculateTax(taxRates.covid)

    const levies = subtotal + getFund + nhil + covid
    const vat = levies * taxRates.vat

    const total = subtotal + vat

    set({ total })
  },
}))

export const useDeliveryStore = create<DeliveryStore>()(
  persist(
    (set) => ({
      deliveryFee: 0,
      setDeliveryFee: (fee) => set({ deliveryFee: fee }),
    }),
    { name: "delivery-fee-storage" }
  )
)

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [],
      loading: true,
      error: null,
      setProductDetails: (details) => set({ products: details }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "product-storage", // Name for localStorage key
    }
  )
)

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set) => ({
      orders: [],
      loading: true,
      error: null,
      setOrderDetails: (details) => set({ orders: details }),
      setOrderLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "order-storage", // Name for localStorage key
    }
  )
)

export const useCustomerStore = create<AddressStore>()(
  persist(
    (set) => ({
      customers: [],
      loading: true,
      error: null,
      setCustomerDetails: (details) => set({ customers: details }),
      setCustomerLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "customer-storage", // Name for localStorage key
    }
  )
)

export const useDateRangeStore = create<DatePickerStore>((set) => ({
  dateRange: [null, null], // Default value
  setDateRange: (range) => set({ dateRange: range }),
}))

export const useProductPriceStore = create<ProductPriceStore>((set) => ({
  price: 0,
  setPrice: (price) => set({ price }),
}))

export const useVariantStore = create<VariantState>((set) => ({
  selectedVariant: {
    price: null,
    weight: null,
    unit: "",
  },
  setSelectedVariant: (price, weight, unit) =>
    set({ selectedVariant: { price, weight, unit } }),
}))

interface OrderDashboardStore {
  order: Order[] | null
  loading: boolean
  error: string | null
  totalRevenue: number
  fetchOrders: () => Promise<void>
}

export const useOrderDashboardStore = create<OrderDashboardStore>((set) => ({
  order: null,
  loading: true,
  error: null,
  totalRevenue: 0, // Add totalRevenue to the store
  fetchOrders: async () => {
    try {
      set({ loading: true, error: null })
      const res = await fetch(`/api/orders`, {
        method: "GET",
        cache: "no-store",
      })

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`)
      }

      const orderDetail = await res.json()

      // Calculate total revenue
      const revenue = orderDetail
        .filter((order: Order) => order.paymentAction === "paid")
        .reduce(
          (sum: any, order: Order) => sum + order.total + order.deliveryFee,
          0
        )

      set({ order: orderDetail, totalRevenue: revenue, loading: false })
    } catch (error) {
      set({ loading: false })
    }
  },
}))

// Define the user type
// type User = {
//   id: string
//   name: string
//   email: string
//   balance: number
//   role: string
//   image: string | null
//   createdAt: string
//   updatedAt: string
//   emailVerified: string | null
//   hashedPassword: string
//   phone: string | null
// }

// Define the store type
type UserStore = {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

// Create the store
export const useUserStore = create<UserStore>((set) => ({
  user: null, // Initial state
  setUser: (user) => set({ user }), // Method to set the user
  clearUser: () => set({ user: null }), // Method to clear the user
}))

// Define the type for a user
// export type User = {
//   id: string
//   name?: string
//   email?: string
//   orders: Order[]
//   balance?: number
//   role: string
//   image?: string | null
//   createdAt: string
//   updatedAt: string
//   emailVerified?: string | null
//   phone?: string | null
// }

// Define the type for the store
type UserListStore = {
  userList: UserDetailType[]
  setUserList: (users: UserDetailType[]) => void
}

// Create the Zustand store
export const useUserListStore = create<UserListStore>((set) => ({
  userList: [],
  setUserList: (users) => set({ userList: users }),
}))
