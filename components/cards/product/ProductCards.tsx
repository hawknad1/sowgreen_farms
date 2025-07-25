// "use client"

// import React from "react"
// import ProductCard from "./ProductCard"
// import HomeProductSkeleton from "../../skeletons/HomeProductSkeleton"
// import { Product } from "@/types"

// interface ProductsProps {
//   data?: Product[]
//   isLoading?: boolean
// }

// const ProductCards = ({ data, isLoading }: ProductsProps) => {
//   return (
//     <>
//       {isLoading ? (
//         <HomeProductSkeleton />
//       ) : (
//         <div className="flex space-x-4  py-8 w-max">
//           {data.map((card) => (
//             <ProductCard data={card} key={card.id} />
//           ))}
//         </div>
//       )}
//     </>
//   )
// }

// export default ProductCards

"use client"
import React from "react"
import ProductCard from "./ProductCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Product } from "@/types"

interface ProductsProps {
  data?: Product
  isLoading?: boolean
}

const ProductCards = ({ data, isLoading }: ProductsProps) => {
  if (isLoading) return <Skeleton className="aspect-square rounded-lg" />
  if (!data) return null

  return <ProductCard data={data} />
}

export default ProductCards
