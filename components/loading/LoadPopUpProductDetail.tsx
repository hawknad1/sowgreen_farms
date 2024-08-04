import React from "react"
import { Skeleton } from "../ui/skeleton"

const LoadPopUpProductDetail = () => {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="w-[200px] h-[200px] rounded-2xl" />
      <div className="h-[200px] flex flex-col flex-1 gap-1">
        <Skeleton className="w-48 h-6 rounded-lg" />
        <Skeleton className="w-48 h-7 rounded-lg" />

        <div className="flex items-center gap-2 space-x-2">
          <Skeleton className="w-20 h-6 rounded-lg" />
          <Skeleton className="w-20 h-6 rounded-lg" />
        </div>
        <Skeleton className="w-16 h-6 rounded-lg" />

        <div className="flex items-center mt-4">
          <Skeleton className="w-48 h-8 rounded-full" />
        </div>
        <div className="flex items-center gap-6 mt-4">
          <Skeleton className="w-32 h-7 rounded-lg" />
          <Skeleton className="w-32 h-7 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default LoadPopUpProductDetail
