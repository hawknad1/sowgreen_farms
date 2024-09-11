import { BookmarkIcon } from "@heroicons/react/20/solid"
import React from "react"

interface StatusPropsCard {
  children: React.ReactNode
}

const OrderStatusCard = ({ children }: StatusPropsCard) => {
  return (
    <div className="border border-neutral-200 flex gap-x-2 items-center justify-center p-2 rounded-lg">
      <div className="bg-red-400 p-1 rounded-md">
        <BookmarkIcon className="size-8" />
      </div>
      <div>
        <h2 className="font-semibold">Order Made</h2>
        <p className="text-sm text-gray-400">Order Created</p>
      </div>
    </div>
  )
}

export default OrderStatusCard
