"use client"
import React from "react"
import { useCartStore } from "@/store"
import { ShoppingCartIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

const ShopBasketIcon = () => {
  const router = useRouter()
  const { cartItemCount } = useCartStore()

  return (
    <div
      // onClick={() => router.push("/basket")}
      className="cursor-pointer relative"
    >
      <ShoppingCartIcon className="size-6" />
      {cartItemCount <= 0 ? (
        ""
      ) : (
        <div className="absolute -top-2.5 -right-2 h-5 w-5 p-1 flex items-center justify-center text-xs bg-red-400 rounded-full text-white">
          <p>{cartItemCount}</p>
        </div>
      )}
    </div>
  )
}

export default ShopBasketIcon
