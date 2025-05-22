export interface Product {
  quantity: number
  product: {
    title: string
  }
  weight?: number
  unit?: string
  quantityTotal: number
  available: boolean
}

interface OrderCache {
  products: Product[]
  timestamp: number
}

const orderCache = new Map<string, OrderCache>()
const SESSION_TTL = 24 * 60 * 60 * 1000 // 24 hours

export const cache = {
  setOrder(phone: string, products: Product[]) {
    orderCache.set(phone, {
      products,
      timestamp: Date.now(),
    })
  },

  getOrder(phone: string): Product[] | null {
    const entry = orderCache.get(phone)
    if (!entry || Date.now() - entry.timestamp > SESSION_TTL) {
      orderCache.delete(phone)
      return null
    }
    return entry.products
  },

  deleteOrder(phone: string) {
    orderCache.delete(phone)
  },
}
