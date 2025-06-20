"use client"
import Image from "next/image"
import React, { useState } from "react"
import { StarIcon } from "@heroicons/react/16/solid"
import { useRouter } from "next/navigation"
import { Product } from "@/types"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { formatWeight } from "@/lib/formatWeight"
import { Plus, Heart } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/store"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ProductCardProps {
  data: Product
  loading?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({ data, loading = false }) => {
  const router = useRouter()
  const { addToCart } = useCartStore()
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  if (loading) {
    return (
      <div className="w-full max-w-xs mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <Skeleton className="w-full h-48 rounded-t-lg" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-1/3" />
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-3 w-3 rounded-full" />
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  const variants = data?.variants || []
  const firstVariant = variants[0] || null
  const discount = data.isInStock === "out-of-stock" ? null : data.discount
  const isOutOfStock = data.isInStock === "out-of-stock"
  const primaryImage = data?.imageUrl || data.images?.[0]?.url
  const secondaryImage = data?.images?.length > 1 ? data.images[1]?.url : null
  const hasDiscount = discount && data?.variants[0]?.discountedPrice

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`size-3 ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
      />
    ))
  }

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (data.variants.length === 1) {
      const variant = data.variants[0]
      addToCart({
        variantId: variant.id,
        productId: data.id,
        weight: variant.weight,
        price: variant.discountedPrice || variant.price,
        unit: variant.unit,
        product: data,
        quantity: 1,
      })
    } else {
      router.push(`/products/${data.id}`)
    }
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  return (
    <TooltipProvider>
      <Link
        href={`/products/${data?.id}`}
        className="group relative block w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges - Top Left */}
        <div className="absolute top-2 left-2 z-20 flex flex-col space-y-1">
          {isOutOfStock ? (
            <Badge className="bg-gray-500/90 text-white rounded-md px-2 py-1 text-xs">
              Out of stock
            </Badge>
          ) : discount ? (
            <Badge className="bg-red-500/90 text-white rounded-md px-2 py-1 text-xs">
              {discount}% OFF
            </Badge>
          ) : null}
        </div>

        {/* Wishlist Button - Top Right */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Product Card Container */}
        <div className="bg-white w-full h-full rounded-lg flex flex-col p-3 border border-gray-100 hover:shadow-md transition-all duration-300">
          {/* Image Section - Fixed Aspect Ratio */}
          <div className="w-full aspect-square relative bg-gray-50 rounded-lg overflow-hidden mb-3">
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <Image
              src={primaryImage}
              alt={data?.title}
              fill
              className={`object-contain transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              } ${data?.images?.length > 1 ? "group-hover:opacity-0" : ""}`}
              onLoad={() => setImageLoading(false)}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt={data?.title}
                fill
                className={`object-contain transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
          </div>

          {/* Product Details Section - Fixed Height */}
          <div className="flex flex-col flex-grow min-h-[60px] max-h-[70px]">
            <h3
              className="font-medium text-gray-900 line-clamp-1 text-sm md:text-base mb-1"
              title={data?.title}
            >
              {data?.title}
            </h3>

            <p className="text-xs text-blue-400 font-normal capitalize mb-2">
              {data?.categoryName}
            </p>

            <div className="flex justify-between items-center mt-auto">
              {data?.variants[0]?.weight > 0 && (
                <div className="flex items-center text-gray-500">
                  <p className="text-xs tracking-wide">
                    {formatWeight(data?.variants[0]?.weight)}
                    {data?.variants[0]?.unit || ""}
                  </p>
                </div>
              )}
              <div className="flex items-center">
                {renderStars(4)}
                <span className="text-xs text-gray-500 ml-1">(24)</span>
              </div>
            </div>
          </div>

          {/* Price Section - Consistent Height */}
          <div className="mt-3">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                {hasDiscount ? (
                  <>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(data.variants[0].discountedPrice, "GHS")}
                    </span>
                    <span className="text-xs text-gray-400 font-medium line-through">
                      {formatCurrency(data.variants[0].price, "GHS")}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(data?.variants[0]?.price, "GHS")}
                  </span>
                )}
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`rounded-full p-2 text-white flex justify-center items-center transition-all ${
                      isOutOfStock
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-700 hover:bg-green-800 group-hover:scale-110"
                    }`}
                    aria-label="Add to cart"
                    onClick={handleAddToCartClick}
                    disabled={isOutOfStock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isOutOfStock ? "Out of stock" : "Add to cart"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </Link>
    </TooltipProvider>
  )
}

export default ProductCard
