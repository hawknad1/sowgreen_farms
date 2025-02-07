"use client"

import Image from "next/image"
import React, { useMemo } from "react"
import { StarIcon } from "@heroicons/react/16/solid"
import { useRouter } from "next/navigation"
import { Product } from "@/types"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { formatWeight } from "@/lib/formatWeight"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/store"

interface ProductCardProps {
  data: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter()
  const { addToCart, cart } = useCartStore()

  // Memoized values to avoid recalculating on each render
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

  // Primary and secondary image URLs
  const primaryImage = data?.imageUrl || data.images[0]?.url
  const secondaryImage = data?.images?.length > 1 ? data.images[1]?.url : null

  const handleCardClick = () => {
    router.push(`/products/${data.id}`)
  }

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent the link from navigating
    e.stopPropagation() // Prevent the card click event from firing

    if (data.variants.length === 1) {
      // If there's only one variant, add it to the cart
      const variant = data.variants[0]
      addToCart({
        variantId: variant.id,
        productId: data.id,
        weight: variant.weight,
        price: variant.price,
        unit: variant.unit,
        product: data,
        quantity: 1,
      })
    } else {
      // If there are multiple variants, navigate to the product detail page
      router.push(`/products/${data.id}`)
    }
  }

  return (
    <Link href={`/products/${data?.id}`} className="relative overflow-hidden">
      <div className="absolute -top-1 z-20">
        {data?.isInStock === "out-of-stock" ? (
          <Badge className="bg-gray-500/40 text-gray-500 rounded-none rounded-tl-md rounded-br-btn">
            Out of stock
          </Badge>
        ) : discount ? (
          <Badge className="bg-red-500/85 rounded-none rounded-tl-md rounded-br-btn ">
            <p className="text-[10px] text-white tracking-wide">
              {discount}% OFF
            </p>
          </Badge>
        ) : null}
      </div>
      <div className="bg-[#F6F6F6] w-64 h-[300px] rounded-lg flex flex-col p-3 relative cursor-pointer">
        {/* Badge Section */}

        {/* Image Section */}
        <div className="w-full h-[170px] relative bg-white rounded-lg shadow-sm">
          <Image
            src={primaryImage}
            alt={data?.title}
            width={100}
            height={100}
            className={`h-full w-full object-contain ${
              data?.images?.length > 1 &&
              "absolute z-10 transition-opacity hover:opacity-0 duration-500 bg-white rounded-lg ease-in-out"
            }`}
          />
          {data?.images?.length > 1 && (
            <Image
              src={secondaryImage}
              alt={data?.title}
              width={100}
              height={100}
              className="absolute h-full w-full object-contain hover:scale-110 transition-transform ease-in-out"
            />
          )}
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col gap-y-2 mt-2">
          <p
            className="font-medium text-[#184532] line-clamp-1"
            title={data?.title}
          >
            {data?.title}
          </p>
          <div className="flex justify-between items-center">
            {data?.variants[0]?.weight > 0 && (
              <div className="flex items-center text-neutral-400 px-0.5">
                <p className="text-sm tracking-wide font-medium">
                  {formatWeight(data?.variants[0]?.weight)}
                </p>
                <p className="text-sm font-medium tracking-wide">
                  {data?.variants[0]?.unit}
                </p>
              </div>
            )}
            <div className="flex">{renderStars(4)}</div>
          </div>
        </div>

        {/* Price and Add to Cart Section */}
        <div className="flex justify-between items-center w-full mt-auto">
          <p className="text-lg tracking-wide font-bold text-[#184532]">
            {formatCurrency(data?.variants[0]?.price, "GHS")}
          </p>
          <button
            className={`rounded-full bg-[#184532] ${
              data?.isInStock === "out-of-stock" && "opacity-50 hover:bg-none"
            } w-8 h-8 text-white flex justify-center items-center hover:bg-[#123724] transition-colors`}
            aria-label="Add to cart"
            onClick={handleAddToCartClick}
            disabled={data?.isInStock === "out-of-stock"}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
