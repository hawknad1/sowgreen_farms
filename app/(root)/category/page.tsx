"use client"
import ProductCard from "@/components/cards/product/ProductCard"
import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
import { Product } from "@/types"
import React, { useEffect, useState } from "react"

type Props = {
  searchParams: {
    q: string
  }
}

const Category = ({ searchParams: { q } }: Props) => {
  const [productsByCategory, setProductsByCategory] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const catProducts = productsByCategory[0]?.products
  useEffect(() => {
    const fetchProductsByCategory = async (catName: string) => {
      try {
        const res = await fetch(`/api/categories/${catName}`)
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`)
        }
        const data = await res.json()
        setProductsByCategory(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }
    fetchProductsByCategory(q)
  }, [q])

  return (
    <main className="container mx-auto py-8 flex-1">
      <div className="flex flex-col items-start gap-5 m-4">
        <h3 className="text-2xl font-bold ml-4 ">
          Showing results for <span>{q.toLowerCase()}</span>
        </h3>
        <div>
          {isLoading ? (
            <ProductsSkeleton />
          ) : (
            <div className="flex gap-5 p-4 w-max">
              {catProducts?.map((product: Product) => (
                <ProductCard key={product.id} data={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Category
