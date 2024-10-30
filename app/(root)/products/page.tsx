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

  console.log(selected, "sele")
  useEffect(() => {
    async function getProducts() {
      setLoading(true) // Ensure loading is set before fetching
      if (selected === "All Category") {
        try {
          console.log("Fetching all products...") // Debugging log
          const res = await fetch(`/api/products`, {
            method: "GET",
            cache: "no-store",
          })

          if (res.ok) {
            const allProducts = await res.json()
            setProducts(allProducts)
            console.log("All products fetched:", allProducts) // Debugging log
          } else {
            console.error("Failed to fetch all products")
          }
        } catch (error) {
          console.error("Error fetching all products:", error)
        }
      } else if (selected) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/categories/${selected}`,
            {
              method: "GET",
              cache: "no-store",
            }
          )

          if (res.ok) {
            const catProducts = await res.json()
            const extractedProducts = catProducts[0]?.products || []
            setProducts(extractedProducts)
            console.log("Category products fetched:", extractedProducts) // Debugging log
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
    <main className="container mx-auto py-8 flex-1">
      <div className="flex items-center flex-col gap-8">
        <h4 className="text-3xl font-bold text-center">
          Organic Fresh Farm Produce
        </h4>
        <div className="flex flex-col gap-5 w-full">
          <div className="flex items-center w-full">
            <h2 className="text-3xl font-bold">Category / </h2>
            <h2 className="text-2xl mt-1 font-bold">{selected || "All"}</h2>
          </div>
          <PaginationButtons />
        </div>
        {loading ? (
          <ProductsSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
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
