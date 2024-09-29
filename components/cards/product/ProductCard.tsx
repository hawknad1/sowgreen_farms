"use client"

import Image from "next/image"
import React, { useMemo } from "react"
import { StarIcon } from "@heroicons/react/16/solid"
import { ShoppingBagIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/navigation"
import { Product } from "@/types"
import { addTax } from "@/lib/addTax"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  data: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter()

  // Memoized values to avoid recalculating on each render
  const taxedPrice = useMemo(() => addTax(data.price).toFixed(2), [data.price])
  const discount = data.isInStock === "out-of-stock" ? null : data.discount

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
    <div onClick={handleCardClick} className="cursor-pointer relative">
      <div className="absolute top-2 left-3">
        {data.isInStock === "out-of-stock" ? (
          <Badge className="bg-gray-500/25 text-gray-500">Out of stock</Badge>
        ) : discount ? (
          <Badge className="bg-red-500/85">
            <p className="text-[10px] text-white tracking-wide">
              {discount}% OFF
            </p>
          </Badge>
        ) : null}
      </div>
      <div className="bg-gray-50 rounded-lg shadow-sm hover:shadow-md h-[265px] w-48">
        <div className="px-3 py-8 flex flex-col gap-4 items-center">
          <div className="">
            <Image
              src={data.imageUrl}
              alt={data.title}
              width={100}
              height={100}
              className="h-[120px] w-[120px] object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="self-start w-full">
            <p className="text-[10px] text-blue-400">{data.categoryName}</p>
            <p className="text-base tracking-wide font-semibold">
              {data.title}
            </p>
            <div className="flex items-center">
              {renderStars(4)}
              <p className="text-[10px] text-blue-500 tracking-wide"> · 4.0</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm tracking-wide font-semibold">{`GHS ${taxedPrice}`}</p>
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
