import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { Order, Product, ShippingAddress } from "./types"
import { CartItem } from "@/types"

interface PaymentStore {
  reference: any
  setReference: (reference: any) => void
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

interface CartState {
  cart: Product[]
  addToCart: (product: Product) => void
  removeFromCart: (product: Product) => void
  clearCart: () => void
}

interface TaxState {
  subtotal: number
  total: number
  calculateTax: () => void
  setSubtotal: (value: number) => void
}

interface OrderDataState {
  ordersData: {
    products: CartItem[]
    shippingAddress: Record<string, any>
    orderNumber: string
    deliveryMethod: string
    referenceNumber: string
    total: number
  } | null
  setOrdersData: (data: any) => void
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],
        addToCart: (product) =>
          set((state) => ({ cart: [...state.cart, product] })),
        removeFromCart: (product) => {
          set((state) => {
            const productToRemoveIndex = state.cart.findIndex(
              (p) => p.id === product.id
            )

            if (productToRemoveIndex === -1) {
              return state
            }

            const newCart = [...state.cart]
            newCart.splice(productToRemoveIndex, 1)
            return { cart: newCart }
          })
        },
        clearCart: () => set({ cart: [] }), // clear the cart
      }),
      {
        name: "shopping-cart-storage",
      }
    )
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

// export const useDeliveryStore = create<DeliveryStore>((set) => ({
//   deliveryFee: 0, // Initial delivery fee
//   setDeliveryFee: (fee) => set({ deliveryFee: fee }),
// }))

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
