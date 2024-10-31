"use client"
import ProductCard from "@/components/cards/product/ProductCard"
import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
import { Product } from "@/types"
import Image from "next/image"
import React, { useEffect, useState, useCallback } from "react"

type Props = {
  searchParams: {
    q: string
  }
}

const Category = ({ searchParams: { q } }: Props) => {
  const [productsByCategory, setProductsByCategory] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProductsByCategory = useCallback(async (catName: string) => {
    try {
      const res = await fetch(`/api/categories/${catName}`)
      if (!res.ok) throw new Error(`Failed to load products: ${res.statusText}`)

      const data = await res.json()
      setProductsByCategory(data)
    } catch (err) {
      setError("Failed to fetch products. Please try again later.")
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (q) {
      fetchProductsByCategory(q)
    }
  }, [q, fetchProductsByCategory])

  const catProducts = productsByCategory[0]?.products || []

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>
  }

  return (
    <main className="container mx-auto py-8 flex-1">
      {catProducts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-center w-full">
            Showing results for <span>{q.toLowerCase()}</span>
          </h3>
        </div>
      )}

      {loading ? (
        <ProductsSkeleton />
      ) : catProducts.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 md:gap-x-8">
          {catProducts.map((product: Product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      ) : (
        <div className="container mx-auto py-8 flex-1 h-screen w-full">
          <div className="flex flex-col items-center mt-4 ">
            <p className="text-3xl font-bold">No available products for {q}</p>
            <p className="text-gray-500">
              We didn’t find what you need, but our farmers are on it!{" "}
            </p>
            <Image
              src="/images/harvester.png"
              alt={q}
              height={600}
              width={700}
              className="h-[500px] w-[500px] object-contain"
            />
          </div>
        </div>
      )}
    </main>
  )
}

export default Category
