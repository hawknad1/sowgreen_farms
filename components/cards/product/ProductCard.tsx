"use client"

import Image from "next/image"
import React, { useMemo } from "react"
import { StarIcon } from "@heroicons/react/16/solid"
import { ShoppingBagIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/navigation"
import { Product } from "@/types"
import { addTax } from "@/lib/addTax"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface ProductCardProps {
  data: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter()

  // Memoized values to avoid recalculating on each render
  const discount = data.isInStock === "out-of-stock" ? null : data.discount

  // const price = data?.weightsAndPrices.map((p) => p.price)
  // const weight = data?.weightsAndPrices.map((w) => w.weight)

  const taxedPrice = formatCurrency(addTax(data.price), "GHS")

  // const taxedPrice = useMemo(() => addTax(price).toFixed(2), [price])

  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`size-3 ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
      />
    ))
  }

  const handleCardClick = () => {
    router.push(`/products/${data.id}`)
  }

  return (
    <div onClick={handleCardClick} className="relative cursor-pointer">
      <div className="absolute top-2 left-3">
        {data.isInStock === "out-of-stock" ? (
          <Badge className="bg-gray-500/40 text-gray-500">Out of stock</Badge>
        ) : discount ? (
          <Badge className="bg-red-500/85">
            <p className="text-[10px] text-white tracking-wide">
              {discount}% OFF
            </p>
          </Badge>
        ) : null}
      </div>
      <div className="flex flex-col h-[260px] w-56">
        <div className="bg-gray-50 rounded-t-lg flex justify-center ">
          <Image
            src={data.imageUrl}
            alt={data.title}
            width={100}
            height={100}
            className="h-[170px] w-full object-contain p-2"
          />
        </div>

        <div className="border border-neutral-300 rounded-b-md ">
          {/* Product Info */}
          <div className="self-start w-full p-2.5">
            <p className="text-[10px] text-blue-400">{data.categoryName}</p>
            <p className="text-base tracking-wide font-semibold line-clamp-1">
              {data.title}
            </p>
            <div className="flex items-center">
              {renderStars(4)}
              <p className="text-[10px] text-blue-500 tracking-wide"> · 4.0</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex">
                <p className="text-sm tracking-wide font-semibold">
                  {taxedPrice}
                </p>
                {data?.weight && (
                  <div className="flex items-center text-neutral-400 px-0.5">
                    <p className="text-sm tracking-wide font-medium">{`/${data?.weight}`}</p>
                    <p className="text-sm tracking-wide font-medium">{`${data?.unit}`}</p>
                  </div>
                )}
              </div>
              <div className="bg-green-300 p-1.5 rounded-full cursor-pointer">
                <ShoppingBagIcon className="size-4 text-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
