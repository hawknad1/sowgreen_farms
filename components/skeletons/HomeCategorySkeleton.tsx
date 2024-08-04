import React from "react"
import { Skeleton } from "../ui/skeleton"

const HomeCategorySkeleton = () => {
  return (
    <div className="flex items-center space-x-4 p-4 w-max">
      <Skeleton className="w-28 h-28 rounded-lg" />
      <Skeleton className="w-28 h-28 rounded-lg" />
      <Skeleton className="w-28 h-28 rounded-lg" />
      <Skeleton className="w-28 h-28 rounded-lg" />
      <Skeleton className="w-28 h-28 rounded-lg" />
      <Skeleton className="w-28 h-28 rounded-lg" />
      <Skeleton className="w-28 h-28 rounded-lg" />
      <Skeleton className="w-28 h-28 rounded-lg" />
      <Skeleton className="w-28 h-28 rounded-lg" />
      <Skeleton className="w-28 h-28 rounded-lg" />
    </div>
  )
}

export default HomeCategorySkeleton
