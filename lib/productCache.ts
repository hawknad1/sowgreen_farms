// interface CacheEntry {
//   products: any[]
//   expires: number
// }

// const cache = new Map<string, CacheEntry>()
// const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

// export const productCache = {
//   set(phone: string, products: any[]) {
//     cache.set(phone, {
//       products,
//       expires: Date.now() + CACHE_TTL,
//     })
//   },

//   get(phone: string): any[] | null {
//     const entry = cache.get(phone)
//     if (!entry || Date.now() > entry.expires) {
//       cache.delete(phone)
//       return null
//     }
//     return entry.products
//   },

//   delete(phone: string) {
//     cache.delete(phone)
//   },
// }

interface CacheEntry {
  products: any[]
  expires: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 23 * 60 * 60 * 1000 // 23 hours (within WhatsApp's 24h window)

export const productCache = {
  set(phone: string, products: any[]) {
    cache.set(phone, {
      products,
      expires: Date.now() + CACHE_TTL,
    })
  },

  get(phone: string): any[] | null {
    const entry = cache.get(phone)
    if (!entry || Date.now() > entry.expires) {
      cache.delete(phone)
      return null
    }
    return entry.products
  },

  delete(phone: string) {
    cache.delete(phone)
  },
}
