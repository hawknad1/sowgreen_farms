"use client"
import { getCartTotal } from "@/lib/getCartTotal"
import { useCartStore } from "@/store"
import React from "react"
import { Separator } from "../ui/separator"

const OrderSummery = () => {
  const cart = useCartStore((state) => state.cart)
  const total = getCartTotal(cart)
  return (
    <div className="">
      <h2 className="text-lg font-semibold divide-y-4 divide-black ">
        Order Summary
      </h2>
      <Separator className="my-3 h-0.5" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400/80">Discount</p>
          <p className="text-sm">GHC 0.00</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400/80">Delivery</p>
          <p className="text-sm">GHC 0.00</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400/80">Tax</p>
          <p className="text-sm">GHC 0.00</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400/80">Total</p>
          <p className="text-xl font-bold">{total}</p>
        </div>
      </div>
    </div>
  )
}

export default OrderSummery
