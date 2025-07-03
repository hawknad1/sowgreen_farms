// app/components/PopularProductsList.tsx (or wherever you prefer)

import CustomersWants from "@/components/cards/product/CustomersWants"
import { getPopularProducts } from "@/lib/data"

// This is an async Server Component
export default async function PopularProductsList() {
  // The await happens HERE, inside the Suspense boundary
  const popularProducts = await getPopularProducts()

  return (
    <CustomersWants
      message="Fresh Farm Produce"
      initialProducts={popularProducts}
    />
  )
}
