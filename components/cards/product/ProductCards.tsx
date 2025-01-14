"use client"

import React from "react"
import ProductCard from "./ProductCard"
import HomeProductSkeleton from "../../skeletons/HomeProductSkeleton"
import { Product } from "@/types"

interface ProductsProps {
  data?: Product[]
  isLoading?: boolean
}

const ProductCards = ({ data, isLoading }: ProductsProps) => {
  return (
    <>
      {isLoading ? (
        <HomeProductSkeleton />
      ) : (
        <div className="flex space-x-4 px-4 py-8 w-max">
          {data.map((card) => (
            <ProductCard data={card} key={card.id} />
          ))}
        </div>
      )}
    </>
  )
}

export default ProductCards
