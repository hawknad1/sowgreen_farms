import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { Order, Product, ShippingAddress } from "./types"
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

// interface CartState {
//   cart: Product[]
//   addToCart: (product: Product) => void
//   removeFromCart: (product: Product) => void
//   clearCart: () => void
// }

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
    referenceNumber: string
    total: number
  } | null
  setOrdersData: (data: any) => void
}

interface VariantState {
  selectedVariant: {
    price: number | null
    weight: number | null
    unit: string | ""
  }
  setSelectedVariant: (price: number, weight: number, unit: string) => void
}

type Variant = {
  id: string
  weight: number
  unit: string
  price: number
}

// type CartState = {
//   selectedVariant: Variant | null
//   quantity: number
//   cart: CartItem[]
//   setSelectedVariant: (variant: Variant | null) => void
//   setQuantity: (quantity: number) => void
//   addToCart: (item: CartItem) => void
//   updateCartItem: (variantId: string, quantity: number) => void
// }
// type CartState = {
//   selectedVariant: any
//   quantity: number
//   cart: CartItem[]
//   setSelectedVariant: (variant: Variant) => void
//   setQuantity: (quantity: number) => void
//   addToCart: (item: CartItem) => void
//   updateCartItem: (variantId: string, quantity: number) => void
//   clearCart: () => void
// }

// export const useCartStore = create<CartState>()(
//   persist(
//     (set) => ({
//       selectedVariant: null,
//       quantity: 1,
//       cart: [],

//       setSelectedVariant: (variant) =>
//         set(() => ({ selectedVariant: variant })),
//       setQuantity: (quantity) => set(() => ({ quantity })),
//       addToCart: (item) =>
//         set((state) => ({
//           cart: [...state.cart, item],
//         })),
//       updateCartItem: (variantId, quantity) =>
//         set((state) => ({
//           cart: state.cart.map((item) =>
//             item.variantId === variantId
//               ? { ...item, quantity: item.quantity + quantity }
//               : item
//           ),
//         })),
//       clearCart: () => set({ cart: [] }), // Clear the cart
//     }),
//     {
//       name: "cart-storage", // Name of the localStorage key
//       partialize: (state) => ({ cart: state.cart }), // Only persist the `cart` state
//     }
//   )
// )

type CartItem = {
  variantId: string
  productId: string
  product: Product
  weight: number
  price: number
  unit: string
  quantity: number
}

// type CartState = {
//   selectedVariant: Variant
//   quantity: number
//   cart: CartItem[]
//   setSelectedVariant: (variant: Variant) => void
//   setQuantity: (quantity: number) => void
//   addToCart: (item: CartItem) => void
//   updateCartItem: (variantId: string, quantity: number) => void
//   removeFromCart: (variantId: string) => void
//   clearCart: () => void
// }

// export const useCartStore = create<CartState>()(
//   persist(
//     (set) => ({
//       selectedVariant: null,
//       quantity: 1,
//       cart: [],

//       setSelectedVariant: (variant) =>
//         set(() => ({ selectedVariant: variant })),
//       setQuantity: (quantity) => set(() => ({ quantity })),
//       addToCart: (item) =>
//         set((state) => ({
//           cart: [...state.cart, item],
//         })),
//       updateCartItem: (variantId, quantity) =>
//         set((state) => ({
//           cart: state.cart.map((item) =>
//             item.variantId === variantId
//               ? { ...item, quantity: Math.max(0, item.quantity + quantity) }
//               : item
//           ),
//         })),

//       removeFromCart: (variantId) =>
//         set((state) => ({
//           cart: state.cart.filter((item) => item.variantId !== variantId),
//         })),
//       clearCart: () => set({ cart: [] }), // Clear the cart
//     }),
//     {
//       name: "cart-storage", // Name of the localStorage key
//       partialize: (state) => ({ cart: state.cart }), // Only persist the `cart` state
//     }
//   )
// )

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
}

// export const useCartStore = create<CartState>()(
//   persist(
//     (set, get) => ({
//       selectedVariant: null,
//       quantity: 1,
//       cart: [],
//       cartTotal: 0, // Initialize total to 0

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
//           return { cart: updatedCart, cartTotal: updatedTotal }
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
//           return { cart: updatedCart, cartTotal: updatedTotal }
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
//           return { cart: updatedCart, cartTotal: updatedTotal }
//         }),

//       clearCart: () =>
//         set(() => ({
//           cart: [],
//           cartTotal: 0, // Reset total to 0 when cart is cleared
//         })),
//     }),
//     {
//       name: "cart-storage", // Name of the localStorage key
//       partialize: (state) => ({ cart: state.cart, cartTotal: state.cartTotal }), // Persist cart and total
//     }
//   )
// )

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      selectedVariant: null,
      quantity: 1,
      cart: [],
      cartTotal: 0, // Initialize total to 0
      cartItemCount: 0, // Initialize count to 0
      cartProducts: {},

      setSelectedVariant: (variant) =>
        set(() => ({ selectedVariant: variant })),
      setQuantity: (quantity) => set(() => ({ quantity })),

      addToCart: (item) =>
        set((state) => {
          const updatedCart = [...state.cart, item]
          const updatedTotal = updatedCart.reduce(
            (acc, cartItem) => acc + cartItem.price * cartItem.quantity,
            0
          )
          const updatedItemCount = updatedCart.reduce(
            (acc, cartItem) => acc + cartItem.quantity,
            0
          )
          return {
            cart: updatedCart,
            cartTotal: updatedTotal,
            cartItemCount: updatedItemCount,
          }
        }),

      updateCartItem: (variantId, quantity) =>
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: Math.max(0, item.quantity + quantity) }
              : item
          )
          const updatedTotal = updatedCart.reduce(
            (acc, cartItem) => acc + cartItem.price * cartItem.quantity,
            0
          )
          const updatedItemCount = updatedCart.reduce(
            (acc, cartItem) => acc + cartItem.quantity,
            0
          )
          return {
            cart: updatedCart,
            cartTotal: updatedTotal,
            cartItemCount: updatedItemCount,
          }
        }),

      removeFromCart: (variantId) =>
        set((state) => {
          const updatedCart = state.cart.filter(
            (item) => item.variantId !== variantId
          )
          const updatedTotal = updatedCart.reduce(
            (acc, cartItem) => acc + cartItem.price * cartItem.quantity,
            0
          )
          const updatedItemCount = updatedCart.reduce(
            (acc, cartItem) => acc + cartItem.quantity,
            0
          )
          return {
            cart: updatedCart,
            cartTotal: updatedTotal,
            cartItemCount: updatedItemCount,
          }
        }),

      clearCart: () =>
        set(() => ({
          cart: [],
          cartTotal: 0, // Reset total to 0 when cart is cleared
          cartItemCount: 0, // Reset item count to 0
        })),
      setCartProducts: (products) =>
        set((state) => ({
          cartProducts: { ...state.cartProducts, ...products },
        })),
    }),
    {
      name: "cart-storage", // Name of the localStorage key
      partialize: (state) => ({
        cart: state.cart,
        cartTotal: state.cartTotal,
        cartItemCount: state.cartItemCount, // Persist cart item count
      }),
    }
  )
)

// export const useCartStore = create<CartState>()(
//   devtools(
//     persist(
//       (set, get) => ({
//         cart: [],
//         addToCart: (product) => {
//           set((state) => {
//             // Check if the product with the same variant is already in the cart
//             const existingProductIndex = state.cart.findIndex(
//               (item) =>
//                 item.id === product.id &&
//                 item.price === product.price &&
//                 item.weight === product.weight
//             )

//             // If the product exists, increment its quantity, otherwise add it
//             if (existingProductIndex !== -1) {
//               const updatedCart = [...state.cart]
//               updatedCart[existingProductIndex].quantity += 1
//               return { cart: updatedCart }
//             } else {
//               return { cart: [...state.cart, { ...product, quantity: 1 }] }
//             }
//           })
//         },
//         removeFromCart: (product) => {
//           set((state) => {
//             const productToRemoveIndex = state.cart.findIndex(
//               (p) =>
//                 p.id === product.id &&
//                 p.price === product.price &&
//                 p.weight === product.weight
//             )

//             if (productToRemoveIndex === -1) {
//               return state
//             }

//             const updatedCart = [...state.cart]
//             if (updatedCart[productToRemoveIndex].quantity > 1) {
//               updatedCart[productToRemoveIndex].quantity -= 1
//             } else {
//               updatedCart.splice(productToRemoveIndex, 1)
//             }
//             return { cart: updatedCart }
//           })
//         },
//         clearCart: () => set({ cart: [] }), // Clear the cart
//       }),
//       {
//         name: "shopping-cart-storage",
//       }
//     )
//   )
// )

// export const useCartStore = create<CartState>()(
//   devtools(
//     persist(
//       (set, get) => ({
//         cart: [],
//         addToCart: (product) =>
//           set((state) => ({ cart: [...state.cart, product] })),
//         removeFromCart: (product) => {
//           set((state) => {
//             const productToRemoveIndex = state.cart.findIndex(
//               (p) => p.id === product.id
//             )

//             if (productToRemoveIndex === -1) {
//               return state
//             }

//             const newCart = [...state.cart]
//             newCart.splice(productToRemoveIndex, 1)
//             return { cart: newCart }
//           })
//         },
//         clearCart: () => set({ cart: [] }), // clear the cart
//       }),
//       {
//         name: "shopping-cart-storage",
//       }
//     )
//   )
// )

// export const useCartStore = create<CartState>()(
//   devtools(
//     persist(
//       (set, get) => ({
//         cart: [],
//         addToCart: (product) => {
//           const { cart } = get()

//           // Check if the product with the same variant ID already exists
//           const existingProductIndex = cart.findIndex(
//             (p) =>
//               p.id === product.id && p.variants[0].id === product.variants[0].id
//           )

//           if (existingProductIndex !== -1) {
//             // If found, increment the quantity of the existing product
//             const updatedCart = [...cart]
//             updatedCart[existingProductIndex].quantity =
//               (updatedCart[existingProductIndex].quantity || 1) + 1
//             set({ cart: updatedCart })
//           } else {
//             // Otherwise, add the new product variant to the cart
//             set({ cart: [...cart, { ...product, quantity: 1 }] })
//           }
//         },
//         removeFromCart: (product) => {
//           set((state) => {
//             const productIndex = state.cart.findIndex(
//               (p) =>
//                 p.id === product.id &&
//                 p.variants[0].id === product.variants[0].id
//             )

//             if (productIndex === -1) {
//               return state // Product not found, no action needed
//             }

//             const updatedCart = [...state.cart]

//             // Decrement the quantity or remove the product if quantity is 1
//             if (updatedCart[productIndex].quantity > 1) {
//               updatedCart[productIndex].quantity -= 1
//             } else {
//               updatedCart.splice(productIndex, 1)
//             }

//             return { cart: updatedCart }
//           })
//         },
//         clearCart: () => set({ cart: [] }), // Clear the entire cart
//       }),
//       {
//         name: "shopping-cart-storage",
//       }
//     )
//   )
// )

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
