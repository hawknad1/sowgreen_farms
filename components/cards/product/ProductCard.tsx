"use client"

import Image from "next/image"
import React, { useState, useEffect } from "react"
import { StarIcon } from "@heroicons/react/16/solid"
import { useRouter } from "next/navigation"
import { Product } from "@/types"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { formatWeight } from "@/lib/formatWeight"
import { Plus, Heart } from "lucide-react"
import Link from "next/link"
import { useCartStore, useWishlistStore } from "@/store"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import toast from "react-hot-toast"

interface ProductCardProps {
  data: Product
  loading?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({ data, loading = false }) => {
  const router = useRouter()
  const { addToCart } = useCartStore()

  const [isHovered, setIsHovered] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { addToWishlist, removeFromWishlist, isInWishlist, status } =
    useWishlistStore()

  useEffect(() => {
    setIsClient(true)
    setIsWishlisted(isInWishlist(data.id))
  }, [isInWishlist, data.id])

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (status === "loading") return

    try {
      if (isWishlisted) {
        await removeFromWishlist(data.id)
        toast.success("Removed from wishlist")
      } else {
        await addToWishlist(data)
        toast.success("Added to wishlist")
      }
      setIsWishlisted(!isWishlisted)
    } catch (error) {
      toast.error("Failed to update wishlist")
    }
  }

  if (!isClient) return null

  if (loading) {
    return (
      <div className="w-full max-w-xs mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
        <Skeleton className="w-full aspect-square rounded-t-lg" />
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
  const primaryImage =
    data?.imageUrl || (data.images?.length ? data.images[0]?.url : "")
  const secondaryImage = data?.images?.length > 1 ? data.images[1]?.url : null
  const hasDiscount = discount && firstVariant?.discountedPrice
  const partnerName = data?.partner?.brand || data?.partner?.owner || ""

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
      toast.success("Added to cart")
    } else {
      router.push(`/products/${data.id}`)
    }
  }

  return (
    <TooltipProvider>
      <Link
        href={`/products/${data?.slug}`}
        className="group relative block w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges - Top Left */}
        <div className="absolute top-2 left-2 z-20 flex flex-col space-y-1">
          {isOutOfStock ? (
            <Badge variant="outline" className="bg-gray-100 text-gray-800">
              Out of stock
            </Badge>
          ) : discount ? (
            <Badge className="bg-red-500 text-white">{discount}% OFF</Badge>
          ) : null}
        </div>

        {/* Wishlist Button - Top Right */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleWishlist}
              className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all hover:scale-110"
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600 hover:text-red-500"
                }`}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Product Card Container */}
        <div className="bg-white w-full h-full rounded-lg flex flex-col p-3 border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group-hover:border-gray-200">
          {/* Image Section */}
          <div className="w-full aspect-square relative bg-gray-50 rounded-lg overflow-hidden mb-3">
            {imageLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
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
              priority={false}
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
                priority={false}
              />
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col flex-grow">
            {partnerName && (
              <div className="mb-1 flex items-center">
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  {partnerName}
                </span>
              </div>
            )}

            <h3 className="font-medium text-gray-900 line-clamp-2 text-sm lg:text-base min-h-[40px] mb-1">
              {data?.title}
            </h3>

            <p className="text-xs text-blue-500 font-medium capitalize mb-2">
              {data?.categoryName}
            </p>

            <div className="flex justify-between items-center mt-auto">
              {firstVariant?.weight > 0 && (
                <div className="flex items-center">
                  <p className="text-xs text-gray-500">
                    {formatWeight(firstVariant?.weight)}
                    {firstVariant?.unit || ""}
                  </p>
                </div>
              )}
              <div className="flex items-center">
                {renderStars(4)}
                <span className="text-xs text-gray-500 ml-1">(24)</span>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="mt-3">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                {hasDiscount ? (
                  <>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(firstVariant.discountedPrice, "GHS")}
                    </span>
                    <span className="text-xs text-gray-400 font-medium line-through">
                      {formatCurrency(firstVariant.price, "GHS")}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(firstVariant?.price, "GHS")}
                  </span>
                )}
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`rounded-full p-2 text-white flex justify-center items-center transition-all ${
                      isOutOfStock
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 group-hover:scale-110"
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

// "use client"

// import Image from "next/image"
// import React, { useState, useEffect } from "react"
// import { StarIcon } from "@heroicons/react/16/solid"
// import { useRouter } from "next/navigation"
// import { Product } from "@/types" // Make sure this path is correct
// import { Badge } from "@/components/ui/badge"
// import { formatCurrency } from "@/lib/utils" // Make sure this path is correct
// import { formatWeight } from "@/lib/formatWeight" // Make sure this path is correct
// import { Plus, Heart } from "lucide-react"
// import Link from "next/link"
// import { useCartStore, useWishlistStore } from "@/store" // Make sure this path is correct
// import { Skeleton } from "@/components/ui/skeleton"
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"
// import toast from "react-hot-toast"

// interface ProductCardProps {
//   data: Product
// }

// const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
//   const router = useRouter()
//   const { addToCart } = useCartStore()
//   const { addToWishlist, removeFromWishlist, isInWishlist, status } =
//     useWishlistStore()

//   const [isHovered, setIsHovered] = useState(false)
//   const [imageLoading, setImageLoading] = useState(true)
//   const [isWishlisted, setIsWishlisted] = useState(false)
//   const [isClient, setIsClient] = useState(false)

//   useEffect(() => {
//     setIsClient(true)
//     // Ensure data.id exists before checking wishlist
//     if (data?.id) {
//       setIsWishlisted(isInWishlist(data.id))
//     }
//   }, [isInWishlist, data?.id])

//   // Use a skeleton for server-side rendering and initial hydration
//   // to prevent layout shifts and errors.
//   if (!isClient || !data) {
//     return (
//       <div className="w-full max-w-xs mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
//         <Skeleton className="w-full aspect-square rounded-t-lg" />
//         <div className="p-4 space-y-3">
//           <Skeleton className="h-4 w-3/4" />
//           <Skeleton className="h-5 w-1/3" />
//         </div>
//       </div>
//     )
//   }

//   // --- SAFE DATA DERIVATION ---
//   // All logic to determine what to display is handled safely here.

//   const firstVariant = data.variants?.[0]
//   const isOutOfStock = data.isInStock === "out-of-stock" || !firstVariant

//   const priceToDisplay = firstVariant?.discountedPrice ?? firstVariant?.price
//   const originalPrice = firstVariant?.discountedPrice
//     ? firstVariant.price
//     : null

//   const primaryImage =
//     data.imageUrl || data.images?.[0]?.url || "/images/placeholder.png"
//   const secondaryImage =
//     data.images && data.images.length > 1 ? data.images[1]?.url : null

//   const partnerName = data.partner?.brand || data.partner?.owner || ""

//   // --- HANDLER FUNCTIONS ---
//   // Your existing handlers are preserved.

//   const toggleWishlist = async (e: React.MouseEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (status === "loading") return
//     try {
//       if (isWishlisted) {
//         await removeFromWishlist(data.id)
//         toast.success("Removed from wishlist")
//       } else {
//         await addToWishlist(data)
//         toast.success("Added to wishlist")
//       }
//       setIsWishlisted(!isWishlisted)
//     } catch (error) {
//       toast.error("Failed to update wishlist")
//     }
//   }

//   const handleAddToCartClick = (e: React.MouseEvent) => {
//     e.preventDefault()
//     e.stopPropagation()

//     if (!firstVariant) {
//       toast.error("This product is currently unavailable.")
//       return
//     }

//     if (data.variants.length === 1) {
//       addToCart({
//         variantId: firstVariant.id,
//         productId: data.id,
//         weight: firstVariant.weight,
//         price: firstVariant.discountedPrice || firstVariant.price,
//         unit: firstVariant.unit,
//         product: data,
//         quantity: 1,
//       })
//       toast.success("Added to cart")
//     } else {
//       router.push(`/products/${data.slug}`)
//     }
//   }

//   const renderStars = (rating: number) => {
//     return [...Array(5)].map((_, i) => (
//       <StarIcon
//         key={i}
//         className={`size-3 ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
//       />
//     ))
//   }

//   return (
//     <TooltipProvider>
//       <Link
//         href={`/products/${data.slug}`}
//         className="group relative block w-full h-full"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <div className="absolute top-2 left-2 z-20 flex flex-col space-y-1">
//           {isOutOfStock && (
//             <Badge variant="outline" className="bg-gray-100 text-gray-800">
//               Out of stock
//             </Badge>
//           )}
//           {originalPrice && data.discount > 0 && (
//             <Badge className="bg-red-500 text-white">
//               {data.discount}% OFF
//             </Badge>
//           )}
//         </div>

//         <Tooltip>
//           <TooltipTrigger asChild>
//             <button
//               onClick={toggleWishlist}
//               className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all hover:scale-110"
//               aria-label={
//                 isWishlisted ? "Remove from wishlist" : "Add to wishlist"
//               }
//             >
//               <Heart
//                 className={`w-4 h-4 transition-colors ${
//                   isWishlisted
//                     ? "fill-red-500 text-red-500"
//                     : "text-gray-600 hover:text-red-500"
//                 }`}
//               />
//             </button>
//           </TooltipTrigger>
//           <TooltipContent side="left">
//             <p>{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</p>
//           </TooltipContent>
//         </Tooltip>

//         <div className="bg-white w-full h-full rounded-lg flex flex-col p-3 border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group-hover:border-gray-200">
//           <div className="w-full aspect-square relative bg-gray-50 rounded-lg overflow-hidden mb-3">
//             {imageLoading && (
//               <div className="absolute inset-0 bg-gray-100 animate-pulse" />
//             )}
//             <Image
//               src={primaryImage}
//               alt={data.title}
//               fill
//               className={`object-contain transition-opacity duration-300 ${
//                 imageLoading ? "opacity-0" : "opacity-100"
//               } ${secondaryImage ? "group-hover:opacity-0" : ""}`}
//               onLoad={() => setImageLoading(false)}
//               sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
//             />
//             {secondaryImage && (
//               <Image
//                 src={secondaryImage}
//                 alt={data.title}
//                 fill
//                 className={`object-contain transition-opacity duration-300 ${
//                   isHovered ? "opacity-100" : "opacity-0"
//                 }`}
//                 sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
//               />
//             )}
//           </div>

//           <div className="flex flex-col flex-grow">
//             {partnerName && (
//               <div className="mb-1">
//                 <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
//                   {partnerName}
//                 </span>
//               </div>
//             )}
//             <h3 className="font-medium text-gray-900 line-clamp-2 text-sm lg:text-base min-h-[40px] mb-1">
//               {data.title}
//             </h3>
//             <p className="text-xs text-blue-500 font-medium capitalize mb-2">
//               {data.categoryName}
//             </p>
//             <div className="flex justify-between items-center mt-auto">
//               {firstVariant?.weight > 0 && (
//                 <p className="text-xs text-gray-500">
//                   {formatWeight(firstVariant.weight)}
//                   {firstVariant.unit || ""}
//                 </p>
//               )}
//               <div className="flex items-center">
//                 {renderStars(data.rating || 4)}
//                 <span className="text-xs text-gray-500 ml-1">(24)</span>
//               </div>
//             </div>
//           </div>

//           <div className="mt-3">
//             <div className="flex justify-between items-center">
//               <div className="flex flex-col">
//                 {priceToDisplay !== undefined && priceToDisplay !== null ? (
//                   <>
//                     <span className="text-lg font-bold text-gray-900">
//                       {formatCurrency(priceToDisplay, "GHS")}
//                     </span>
//                     {originalPrice !== null && (
//                       <span className="text-xs text-gray-400 font-medium line-through">
//                         {formatCurrency(originalPrice, "GHS")}
//                       </span>
//                     )}
//                   </>
//                 ) : (
//                   <span className="text-sm font-medium text-gray-500">
//                     Price unavailable
//                   </span>
//                 )}
//               </div>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <button
//                     className={`rounded-full p-2 text-white flex justify-center items-center transition-all ${
//                       isOutOfStock
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-green-600 hover:bg-green-700 group-hover:scale-110"
//                     }`}
//                     aria-label="Add to cart"
//                     onClick={handleAddToCartClick}
//                     disabled={isOutOfStock}
//                   >
//                     <Plus className="w-4 h-4" />
//                   </button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>{isOutOfStock ? "Out of stock" : "Add to cart"}</p>
//                 </TooltipContent>
//               </Tooltip>
//             </div>
//           </div>
//         </div>
//       </Link>
//     </TooltipProvider>
//   )
// }

// export default ProductCard
