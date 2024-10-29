"use client"

import React, { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import HomeProductSkeleton from "../../skeletons/HomeProductSkeleton"

const ProductCards = () => {
  const [productList, setProductList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getProductList() {
      try {
        const res = await fetch("/api/products", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const products = await res.json()
          setProductList(products)
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getProductList()
  }, [])

  console.log(productList, "plist")

  return (
    <>
      {isLoading ? (
        <HomeProductSkeleton />
      ) : (
        <div className="flex space-x-4 px-4 py-8 w-max">
          {productList.map((card) => (
            <ProductCard data={card} key={card.id} />
          ))}
        </div>
      )}
    </>
  )
}

export default ProductCards
