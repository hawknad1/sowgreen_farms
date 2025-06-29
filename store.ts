import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import {
  DispatchRider,
  Order,
  Product,
  ShippingAddress,
  Staff,
  User,
  UserDetailType,
} from "./types"
import { fetchUserBalance } from "./lib/actions/fetchUserBalance"
import { toast } from "sonner"

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
    whatsappOptIn: boolean
    deliveryDate: string
    balanceDeducted: number
    updatedOrderTotal: number
    updatedBalance: number
    referenceNumber: string
    total: number
    subtotal: number
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
  dispatchRiders: Staff[]
  fetchDispatchRiders: () => Promise<void>
}

interface OrderDashboardStore {
  order: Order[] | null
  loading: boolean
  error: string | null
  totalRevenue: number
  fetchOrders: () => Promise<void>
}

// Define the type for the store
type UserListStore = {
  userList: UserDetailType[]
  setUserList: (users: UserDetailType[]) => void
  balance: number
  setBalance: (balance: number) => void
}

// Define the store type
type UserStore = {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

interface WorkersStore {
  workers: Staff[]
  loading: boolean
  error: string | null
  fetchWorkers: () => Promise<void>
}

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

// export const useDispatchRidersStore = create<DispatchRidersStore>((set) => ({
//   dispatchRiders: [],
//   fetchDispatchRiders: async () => {
//     try {
//       const res = await fetch("/api/dispatch-riders", {
//         method: "GET",
//         cache: "no-store",
//       })

//       if (res.ok) {
//         const riders = await res.json()
//         set({ dispatchRiders: riders })
//       }
//     } catch (error) {
//       console.error("Error fetching dispatch riders:", error)
//     }
//   },
// }))

export const useDispatchRidersStore = create<DispatchRidersStore>((set) => ({
  dispatchRiders: [],
  fetchDispatchRiders: async () => {
    try {
      const res = await fetch("/api/management/staff", {
        method: "GET",
        cache: "no-store",
      })

      if (res.ok) {
        const data = await res.json()
        const riders = data.filter(
          (user: Staff) => user.jobTitle === "dispatch rider"
        )

        set({ dispatchRiders: riders })
      }
    } catch (error) {
      console.error("Error fetching dispatch riders:", error)
    }
  },
}))

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

// Create the store
export const useUserStore = create<UserStore>((set) => ({
  user: null, // Initial state
  setUser: (user) => set({ user }), // Method to set the user
  clearUser: () => set({ user: null }), // Method to clear the user
}))

export const useUserListStore = create<UserListStore>()(
  persist(
    (set) => ({
      userList: [],
      setUserList: (users) => set({ userList: users }),
      balance: 0,
      setBalance: (updatedBalance) => set({ balance: updatedBalance }),
      fetchAndSetBalance: async (email: string) => {
        const balance = await fetchUserBalance(email)
        set({ balance })
      },
    }),
    {
      name: "user-list-store",
    }
  )
)

export const useWorkersStore = create<WorkersStore>((set) => ({
  workers: [],
  loading: false,
  error: null,
  fetchWorkers: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch("/api/management/staff")
      if (!response.ok) throw new Error("Failed to fetch workers")
      const workers = await response.json()
      set({ workers, loading: false })
    } catch (error) {
      set({ loading: false })
    }
  },
}))

// export const useUserListStore = create<UserListStore>()(
//   persist(
//     (set) => ({
//       userList: [],
//       setUserList: (users) => set({ userList: users }),
//       balance: 0,
//       setBalance: (updatedBalance) => set({ balance: updatedBalance }),
//     }),
//     {
//       name: "user-list-store", // Unique name for the localStorage key
//     }
//   )
// )

// interface WishlistStore {
//   wishlist: Product[]
//   isLoading: boolean
//   error: string | null
//   fetchWishlist: () => Promise<void>
//   addToWishlist: (product: Product) => Promise<void>
//   removeFromWishlist: (productId: string) => Promise<void>
//   isInWishlist: (productId: string) => boolean
//   clearWishlist: () => void
// }

// export const useWishlistStore = create<WishlistStore>()(
//   persist(
//     (set, get) => ({
//       wishlist: [],
//       isLoading: false,
//       error: null,

//       fetchWishlist: async () => {
//         set({ isLoading: true, error: null })
//         try {
//           const response = await fetch("/api/wishlist")
//           if (!response.ok) throw new Error("Failed to fetch wishlist")
//           const wishlist = await response.json()
//           set({ wishlist, isLoading: false })
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "Unknown error",
//             isLoading: false,
//           })
//         }
//       },

//       addToWishlist: async (product) => {
//         if (get().isInWishlist(product.id)) return

//         set({ isLoading: true, error: null })
//         try {
//           const response = await fetch("/api/wishlist", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ productId: product.id }),
//           })

//           if (!response.ok) throw new Error("Failed to add to wishlist")

//           set((state) => ({
//             wishlist: [...state.wishlist, product],
//             isLoading: false,
//           }))
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "Unknown error",
//             isLoading: false,
//           })
//         }
//       },

//       removeFromWishlist: async (productId) => {
//         set({ isLoading: true, error: null })
//         try {
//           const response = await fetch("/api/wishlist", {
//             method: "DELETE",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ productId }),
//           })

//           if (!response.ok) throw new Error("Failed to remove from wishlist")

//           set((state) => ({
//             wishlist: state.wishlist.filter((item) => item.id !== productId),
//             isLoading: false,
//           }))
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "Unknown error",
//             isLoading: false,
//           })
//         }
//       },

//       isInWishlist: (productId) =>
//         get().wishlist.some((item) => item.id === productId),

//       clearWishlist: () => set({ wishlist: [] }),
//     }),
//     {
//       name: "wishlist-storage",
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         wishlist: state.wishlist,
//       }),
//     }
//   )
// )

// Define the store's state and actions interface
interface WishlistStore {
  wishlist: Product[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  fetchWishlist: () => Promise<void>
  addToWishlist: (product: Product) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  clearWishlist: () => Promise<void>
  isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      // Use a status enum instead of isLoading and error booleans
      status: "idle",
      error: null,

      fetchWishlist: async () => {
        // Prevent re-fetching if already loading or succeeded
        if (get().status === "loading" || get().status === "succeeded") return

        set({ status: "loading", error: null })
        try {
          const response = await fetch("/api/wishlist")
          if (!response.ok) throw new Error("Failed to fetch wishlist")
          const wishlist = await response.json()
          set({ wishlist, status: "succeeded" })
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred"
          set({ status: "failed", error: errorMessage })
        }
      },

      addToWishlist: async (product) => {
        if (get().isInWishlist(product.id)) return

        const originalWishlist = get().wishlist
        // Optimistic update
        set({
          wishlist: [...originalWishlist, product],
        })

        try {
          const response = await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.id }),
          })

          if (!response.ok) {
            throw new Error("Failed to add item to wishlist.")
          }
        } catch (error) {
          toast(
            error instanceof Error ? error.message : "An unknown error occurred"
          )
          // Rollback on failure
          set({ wishlist: originalWishlist })
        }
      },

      removeFromWishlist: async (productId) => {
        const originalWishlist = get().wishlist
        // Optimistic update
        set({
          wishlist: originalWishlist.filter((item) => item.id !== productId),
        })

        try {
          const response = await fetch("/api/wishlist", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          })

          if (!response.ok) {
            throw new Error("Failed to remove item from wishlist.")
          }
        } catch (error) {
          toast(
            error instanceof Error ? error.message : "An unknown error occurred"
          )
          // Rollback on failure
          set({ wishlist: originalWishlist })
        }
      },

      // Centralize the clear wishlist logic here
      clearWishlist: async () => {
        const originalWishlist = get().wishlist
        if (originalWishlist.length === 0) return

        // Optimistically clear the UI
        set({ wishlist: [] })

        try {
          // You could create a dedicated `/api/wishlist/clear` endpoint
          // to make this a single, more efficient API call.
          // For now, we'll stick to the multiple-call approach.
          const responses = await Promise.all(
            originalWishlist.map((product) =>
              fetch("/api/wishlist", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id }),
              })
            )
          )

          const allSuccessful = responses.every((res) => res.ok)
          if (!allSuccessful) {
            throw new Error(
              "Some items could not be removed from the wishlist."
            )
          }

          toast("Wishlist cleared successfully")
        } catch (error) {
          toast(
            error instanceof Error ? error.message : "Failed to clear wishlist."
          )
          // Rollback the entire wishlist on failure
          set({ wishlist: originalWishlist })
          // Optionally re-fetch to ensure sync with the server
          get().fetchWishlist()
        }
      },

      isInWishlist: (productId) =>
        get().wishlist.some((item) => item.id === productId),
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist the wishlist itself, not its transient status
      partialize: (state) => ({
        wishlist: state.wishlist,
      }),
    }
  )
)

// export const useWishlistStore = create<WishlistStore>()(
//   persist(
//     (set, get) => ({
//       wishlist: [],
//       isLoading: false,
//       error: null,

//       fetchWishlist: async () => {
//         set({ isLoading: true, error: null })
//         try {
//           const response = await fetch("/api/wishlist")
//           if (!response.ok) throw new Error("Failed to fetch wishlist")
//           const wishlist = await response.json()
//           set({ wishlist, isLoading: false })
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "Unknown error",
//             isLoading: false,
//           })
//         }
//       },

//       addToWishlist: async (product) => {
//         if (get().isInWishlist(product.id)) return

//         // Optimistically add to wishlist
//         set((state) => ({
//           wishlist: [...state.wishlist, product],
//           error: null, // Clear any previous errors
//         }))

//         try {
//           const response = await fetch("/api/wishlist", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ productId: product.id }),
//           })

//           if (!response.ok) {
//             // If API call fails, revert the optimistic update
//             set((state) => ({
//               wishlist: state.wishlist.filter((item) => item.id !== product.id),
//               error: "Failed to add to wishlist",
//             }))
//             throw new Error("Failed to add to wishlist")
//           }

//           // No need to update state here, as it was already updated optimistically
//           // set({ isLoading: false }); // Only set isLoading to false after successful response if you still use it elsewhere
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "Unknown error",
//             // isLoading: false, // Only set isLoading to false after successful response if you still use it elsewhere
//           })
//           // The UI was already reverted in the catch block for !response.ok,
//           // but good to have a general error set for other types of errors.
//         } finally {
//           set({ isLoading: false }) // Ensure isLoading is reset regardless of success or failure
//         }
//       },

//       removeFromWishlist: async (productId) => {
//         const originalWishlist = get().wishlist // Store current wishlist for potential rollback
//         // Optimistically remove from wishlist
//         set((state) => ({
//           wishlist: state.wishlist.filter((item) => item.id !== productId),
//           error: null, // Clear any previous errors
//         }))

//         try {
//           const response = await fetch("/api/wishlist", {
//             method: "DELETE",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ productId }),
//           })

//           if (!response.ok) {
//             // If API call fails, revert the optimistic update
//             set({
//               wishlist: originalWishlist,
//               error: "Failed to remove from wishlist",
//             })
//             throw new Error("Failed to remove from wishlist")
//           }

//           // No need to update state here, as it was already updated optimistically
//           // set({ isLoading: false }); // Only set isLoading to false after successful response if you still use it elsewhere
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : "Unknown error",
//             // isLoading: false, // Only set isLoading to false after successful response if you still use it elsewhere
//           })
//           // The UI was already reverted in the catch block for !response.ok,
//           // but good to have a general error set for other types of errors.
//         } finally {
//           set({ isLoading: false }) // Ensure isLoading is reset regardless of success or failure
//         }
//       },

//       isInWishlist: (productId) =>
//         get().wishlist.some((item) => item.id === productId),

//       clearWishlist: () => set({ wishlist: [] }),
//     }),
//     {
//       name: "wishlist-storage",
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         wishlist: state.wishlist,
//       }),
//     }
//   )
// )
