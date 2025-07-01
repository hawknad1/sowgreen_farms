// lib/productService.ts
import { Product } from "@/types"

export async function fetchAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      cache: "no-store", // Matches your original no-cache approach
    })
    if (!res.ok) throw new Error("Failed to fetch products")
    return await res.json()
  } catch (error) {
    console.error("Error fetching all products:", error)
    return []
  }
}

export async function fetchProductsByCategory(
  category: string
): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${encodeURIComponent(
        category
      )}`,
      {
        cache: "no-store", // Matches your original no-cache approach
      }
    )
    if (!res.ok) throw new Error("Failed to fetch products by category")
    const data = await res.json()
    return data[0]?.products || []
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error)
    return []
  }
}
