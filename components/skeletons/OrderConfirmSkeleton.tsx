import React from "react"
import { Skeleton } from "../ui/skeleton"

const OrderConfirmSkeleton = () => {
  return (
    <div className="max-3xl rounded-lg">
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default OrderConfirmSkeleton
