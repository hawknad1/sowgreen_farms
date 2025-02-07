import React from "react"
import { Skeleton } from "../ui/skeleton"

const ProductsSkeleton = () => {
  return (
    <div className="container mx-auto py-8 flex-1">
      <div className="w-full grid grid-cols-1 gap-y-8 sm:grid-cols-2 place-items-center lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4">
        <Skeleton className="w-64 h-[300px] rounded-lg" />
        <Skeleton className="w-64 h-[300px] rounded-lg" />
        <Skeleton className="w-64 h-[300px] rounded-lg" />
        <Skeleton className="w-64 h-[300px] rounded-lg" />
        <Skeleton className="w-64 h-[300px] rounded-lg" />
        <Skeleton className="w-64 h-[300px] rounded-lg" />
        <Skeleton className="w-64 h-[300px] rounded-lg" />
        <Skeleton className="w-64 h-[300px] rounded-lg" />
      </div>
    </div>
  )
}

export default ProductsSkeleton
