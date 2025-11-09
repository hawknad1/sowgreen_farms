import { Product } from "@/types"
import prisma from "./prismadb"

const taxRate = 0

// const taxRate = 0.12

// export const calculatePriceWithTax = (price: number) => {
//   return price + price * taxRate
// }

// export const applyTaxToProduct = (productData: Product) => {
//   return {
//     ...productData,
//     variants:
//       productData.variants?.map((variant) => ({
//         ...variant,
//         originalPrice: variant.price,
//         price: calculatePriceWithTax(variant.price),
//         discountedPrice: variant.discountedPrice
//           ? calculatePriceWithTax(variant.discountedPrice)
//           : null,
//       })) || [],
//   }
// }

// export const applyTaxToProducts = (products: Product[]) => {
//   return products.map(applyTaxToProduct)
// }

// services/taxService.ts
export class TaxService {
  private static currentTaxRate: number | null = null
  private static lastFetch: number = 0
  private static CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  static async getCurrentTaxRate(): Promise<number> {
    // Cache to avoid DB calls on every request
    const now = Date.now()
    if (this.currentTaxRate && now - this.lastFetch < this.CACHE_DURATION) {
      return this.currentTaxRate
    }

    try {
      const taxRate = await prisma.taxRate.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      })

      if (!taxRate) {
        // Fallback to default rate
        return 0.0
      }

      this.currentTaxRate = taxRate.rate
      this.lastFetch = now
      return taxRate.rate
    } catch (error) {
      console.error("Failed to fetch tax rate:", error)
      return 0.12 // Fallback rate
    }
  }

  static async calculatePriceWithTax(price: number): Promise<number> {
    const taxRate = await this.getCurrentTaxRate()
    return price + price * taxRate
  }

  static async applyTaxToProduct(productData: Product): Promise<Product> {
    const taxRate = await this.getCurrentTaxRate()

    return {
      ...productData,
      variants:
        productData.variants?.map((variant) => ({
          ...variant,
          originalPrice: variant.price,
          price: variant.price + variant.price * taxRate,
          discountedPrice: variant.discountedPrice
            ? variant.discountedPrice + variant.discountedPrice * taxRate
            : null,
        })) || [],
    }
  }

  static async applyTaxToProducts(products: Product[]): Promise<Product[]> {
    return Promise.all(
      products.map((product) => this.applyTaxToProduct(product))
    )
  }

  // Invalidate cache when tax rate changes
  static invalidateCache() {
    this.currentTaxRate = null
    this.lastFetch = 0
  }
}
