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
import { formatWeight } from "@/lib/formatWeight"

interface ProductCardProps {
  data: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter()

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

      <div className="flex flex-col justify-between w-[280px] h-[270px] sm:w-[260px] border border-neutral-400/25 rounded-lg overflow-hidden">
        {/* Image Container */}
        <div className="w-full h-full bg-gray-50 relative">
          <Image
            src={primaryImage}
            alt={data.title}
            width={100}
            height={100}
            className={`h-[170px] w-full object-contain bg-gray-50 rounded-t-lg p-2 ${
              data?.images?.length > 1 &&
              "absolute z-10 transition-opacity hover:opacity-0 duration-500 ease-in-out"
            }`}
          />

          {/* Secondary Image - Only if there are multiple images */}
          {data?.images?.length > 1 && (
            <Image
              src={secondaryImage}
              alt={data.title}
              width={100}
              height={100}
              className="absolute h-[170px] w-full object-contain bg-gray-50 rounded-t-lg p-2 hover:scale-110 transition-transform ease-in-out"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="w-full h-[45%] border border-neutral-400/30">
          <div className="self-start w-full p-2.5">
            <p className="text-[10px] text-blue-400">{data.categoryName}</p>
            <p className="text-base tracking-wide font-semibold line-clamp-1">
              {data.title}
            </p>
            <div className="flex items-center justify-between pt-2">
              <div className="flex">
                <p className="text-sm tracking-wide font-medium">
                  {formatCurrency(data?.variants[0]?.price, "GHS")}
                </p>
                {data?.variants[0]?.weight > 0 && (
                  <div className="flex items-center text-neutral-400 px-0.5">
                    <p className="text-sm tracking-wide font-medium">{`/${formatWeight(
                      data?.variants[0]?.weight
                    )}`}</p>
                    <p className="text-sm tracking-wide font-medium">{`${data?.variants[0]?.unit}`}</p>
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

// <div className="flex flex-col h-[270px] w-64">
//         <div className="relative w-full h-[170px]">
//           {/* Primary Image */}
//           <Image
//             src={primaryImage}
//             alt={data.title}
//             width={100}
//             height={100}
//             className={`h-[170px] w-full object-contain bg-gray-50 rounded-t-lg p-2 ${
//               data?.images?.length > 1 &&
//               "absolute z-10 transition-opacity hover:opacity-0 duration-500 ease-in-out"
//             }`}
//           />

//           {/* Secondary Image - Only if there are multiple images */}
//           {data?.images?.length > 1 && (
//             <Image
//               src={secondaryImage}
//               alt={data.title}
//               width={100}
//               height={100}
//               className="absolute h-[170px] w-full object-contain bg-gray-50 rounded-t-lg p-2 hover:scale-110 transition-transform ease-in-out"
//             />
//           )}
//         </div>

//         <div className="border border-neutral-300 rounded-b-md ">
//           {/* Product Info */}
//           <div className="self-start w-full p-2.5">
//             <p className="text-[10px] text-blue-400">{data.categoryName}</p>
//             <p className="text-base tracking-wide font-semibold line-clamp-1">
//               {data.title}
//             </p>
//             <div className="flex items-center">
//               {renderStars(4)}
//               <p className="text-[10px] text-blue-500 tracking-wide"> · 4.0</p>
//             </div>
//             <div className="flex items-center justify-between pt-2">
//               <div className="flex">
//                 <p className="text-sm tracking-wide font-semibold">
//                   {formatCurrency(data?.variants[0]?.price, "GHS")}
//                 </p>
//                 {data?.variants[0]?.weight > 0 && (
//                   <div className="flex items-center text-neutral-400 px-0.5">
//                     <p className="text-sm tracking-wide font-medium">{`/${formatWeight(
//                       data?.variants[0]?.weight
//                     )}`}</p>
//                     <p className="text-sm tracking-wide font-medium">{`${data?.variants[0]?.unit}`}</p>
//                   </div>
//                 )}
//               </div>
//               <div className="bg-green-300 p-1.5 rounded-full cursor-pointer">
//                 <ShoppingBagIcon className="size-4 text-gray-800" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
