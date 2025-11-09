import React from "react"
import ProductsClient from "./ProductsClient"
import { getCategories } from "@/lib/utils"
import { Product } from "@/types"
import prisma from "@/lib/prismadb"
import { TaxService } from "@/lib/serviceCharge"
// import { applyTaxToProduct, applyTaxToProducts } from "@/lib/serviceCharge"

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
  let where: any = {}
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

    console.log("Fetched products from DB:", productsFromDb)

    // cast Prisma result to Product[] to satisfy applyTaxToProducts type
    // const newProduct = applyTaxToProducts(
    //   productsFromDb as unknown as Product[]
    // )

    const productsWithTax = await TaxService.applyTaxToProducts(
      productsFromDb as unknown as Product[]
    )

    // ✅ Apply the same type casting and serialization fix here
    const serializedProducts = productsWithTax.map((product: Product) => ({
      ...product,
      createdAt: new Date(product.createdAt).toISOString(),
      updatedAt: new Date(product.updatedAt).toISOString(),
      images: (product.images as { url: string; publicId: string }[]) || [],
      variants: product.variants.map((variant: any) => ({
        ...variant,
        createdAt: variant.createdAt
          ? new Date(variant.createdAt).toISOString()
          : null,
        updatedAt: variant.updatedAt
          ? new Date(variant.updatedAt).toISOString()
          : null,
      })),
      productHistory: product.productHistory
        ? product.productHistory.map((history) => ({
            ...history,
            createdAt: new Date(history.createdAt).toISOString(),
          }))
        : [],
    }))

    return serializedProducts
  } catch (error) {
    console.error("Error fetching initial products:", error)
    return []
  }
}

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: { sort?: string; category?: string }
}) => {
  const { sort, category } = searchParams
  const initialProducts = await getProducts(sort, category)
  const categories = await getCategories()

  return (
    <ProductsClient initialProducts={initialProducts} categories={categories} />
  )
}

export default ProductsPage
