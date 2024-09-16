import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { Product } from "./types"
import { CartItem } from "@/types"

interface PaymentStore {
  reference: any
  setReference: (reference: any) => void
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

interface OrderState {
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

export const useOrdersStore = create(
  persist<OrderState>(
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

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  deliveryFee: 30, // Initial delivery fee
  setDeliveryFee: (fee) => set({ deliveryFee: fee }),
}))
