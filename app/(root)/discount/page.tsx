import React from "react"
import DiscountClient from "./DiscountClient"
import { getCategories } from "@/lib/utils"
import prisma from "@/lib/prismadb"
import { Product } from "@/types"

interface ProductsPageProps {
  searchParams: {
    sort?: string
    category?: string
  }
}

async function getProducts(
  sort?: string,
  category?: string
): Promise<Product[]> {
  let where: any = {
    discount: {
      gt: 0, // 'gt' means "greater than"
    },
  }
  let orderBy: any = {}

  if (category && category !== "All Category") {
    where.categoryName = category
  }

  // ✅ Apply the same corrected sorting logic here
  switch (sort) {
    case "popularity":
      orderBy = { purchaseCount: "desc" }
      break
    case "price-low":
      orderBy = { variants: { _min: { price: "asc" } } }
      break
    case "price-high":
      orderBy = { variants: { _max: { price: "desc" } } }
      break
    case "newest":
      orderBy = { createdAt: "desc" }
      break
    default:
      orderBy = { title: "asc" }
      break
  }

  try {
    const productsFromDb = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        variants: true,
        partner: true,
        category: true,
        wishLists: true,
        productHistory: true,
        priceHistory: true,
      },
    })

    // ✅ Apply the same type casting and serialization fix here
    const serializedProducts = productsFromDb.map((product) => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      images: (product.images as { url: string; publicId: string }[]) || [],
      variants: product.variants.map((variant) => ({
        ...variant,
        createdAt: variant.createdAt.toISOString(),
        updatedAt: variant.updatedAt.toISOString(),
      })),
      productHistory: product.productHistory
        ? product.productHistory.map((history) => ({
            ...history,
            createdAt: history.createdAt.toISOString(),
          }))
        : [],
    }))

    return serializedProducts
  } catch (error) {
    console.error("Error fetching initial products:", error)
    return []
  }
}

// ... (The rest of your ProductsPage component)
const ProductsPage = async ({
  searchParams,
}: {
  searchParams: { sort?: string; category?: string }
}) => {
  const { sort, category } = searchParams
  const initialProducts = await getProducts(sort, category)
  const categories = await getCategories()

  return (
    <DiscountClient initialProducts={initialProducts} categories={categories} />
  )
}

export default ProductsPage
