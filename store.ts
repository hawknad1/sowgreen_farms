import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { Product } from "./types"
import { CartItem } from "@/types"

// import type {} from "@redux-devtools/extension"  // required for devtools typing

interface CartState {
  cart: Product[]
  addToCart: (product: Product) => void
  removeFromCart: (product: Product) => void
  clearCart: () => void
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

interface PaymentStore {
  reference: any
  setReference: (reference: any) => void
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  reference: null,
  setReference: (reference) => set({ reference }),
}))

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
