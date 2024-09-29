"use client"
import ProductCard from "@/components/cards/product/ProductCard"
import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
import PaginationButtons from "@/components/sort/PaginationButtons"
import { useCategoryState } from "@/hooks/state"
import { useProductStore } from "@/store"
import React, { useEffect, useState } from "react"

const Products = () => {
  const [products, setProducts] = useState([])
  const setProductDetails = useProductStore((state) => state.setProductDetails)
  const [loading, setLoading] = useState(true)
  const { selected } = useCategoryState()

  useEffect(() => {
    async function getProductList() {
      try {
        const res = await fetch("/api/products", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const products = await res.json()
          setProducts(products)
          setProductDetails(products)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getProductList()
  }, [])

  return (
    <main className="container mx-auto py-8 flex-1">
      <div className="flex items-center flex-col gap-8">
        <h4 className="text-3xl font-bold text-center">
          Organic Fresh Farm Produce
        </h4>
        <div className=" flex flex-col gap-5 w-full">
          <div className="flex items-center w-full">
            <h2 className="text-3xl font-bold">Category / </h2>
            <h2 className="text-2xl mt-1 font-bold">{selected}</h2>
          </div>
          <PaginationButtons />
        </div>
        {loading ? (
          <ProductsSkeleton />
        ) : (
          <div className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
              {products?.map((card) => (
                <ProductCard data={card} key={card.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Products
