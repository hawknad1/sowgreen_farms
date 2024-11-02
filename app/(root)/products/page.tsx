"use client"

import React, { useEffect, useState } from "react"
import ProductCard from "@/components/cards/product/ProductCard"
import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
import PaginationButtons from "@/components/sort/PaginationButtons"
import { useCategoryState } from "@/hooks/state"
import { Product } from "@/types"

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { selected } = useCategoryState()

  useEffect(() => {
    async function getProducts() {
      setLoading(true) // Ensure loading is set before fetching
      if (selected === "All Category") {
        try {
          const res = await fetch(`/api/products`, {
            method: "GET",
            cache: "no-store",
          })

          if (res.ok) {
            const allProducts = await res.json()
            setProducts(allProducts)
          } else {
            console.error("Failed to fetch all products")
          }
        } catch (error) {
          console.error("Error fetching all products:", error)
        }
      } else if (selected) {
        try {
          const res = await fetch(`/api/categories/${selected}`, {
            method: "GET",
            cache: "no-store",
          })

          if (res.ok) {
            const catProducts = await res.json()
            const extractedProducts = catProducts[0]?.products || []
            setProducts(extractedProducts)
            // console.log("Category products fetched:", extractedProducts) // Debugging log
          } else {
            console.error("Failed to fetch category products")
          }
        } catch (error) {
          console.error("Error fetching category products:", error)
        }
      }
      setLoading(false)
    }

    getProducts()
  }, [selected])

  return (
    <main className="container mx-auto py-8 flex-1 min-h-0 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-6 sm:gap-8">
        <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
          Organic Fresh Farm Produce
        </h4>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-center w-full gap-2">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-600">
              Category /
            </h2>
            <h2 className="text-lg sm:text-xl lg:text-2xl mt-1 font-bold text-neutral-600">
              {selected || "All"}
            </h2>
          </div>
          <PaginationButtons />
        </div>
        {loading ? (
          <ProductsSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 ">
            {products.map((product: Product) => (
              <ProductCard data={product} key={product.id} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Products
