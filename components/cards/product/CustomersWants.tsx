"use client"
import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
import { Product } from "@/types"
import React, { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import ProductChevrons from "@/components/ProductChevrons"
import ProductCards from "./ProductCards"

const CustomersWants = () => {
  const [productList, setProductList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getPopularProductList() {
      try {
        const res = await fetch("/api/products/popular", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const popularProducts = await res.json()
          setProductList(popularProducts)
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getPopularProductList()
  }, [])

  const message = `Customers also bought`

  return (
    <ProductChevrons message={message}>
      <ProductCards data={productList} isLoading={isLoading} />
    </ProductChevrons>
  )
}

export default CustomersWants
