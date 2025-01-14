"use client"
import React from "react"

import { useCartStore, useDeliveryStore } from "@/store"
import { Separator } from "../ui/separator"
import { formatCurrency } from "@/lib/utils"

const BasketOrderSummery = () => {
  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const { cartTotal } = useCartStore()

  const total = cartTotal + deliveryFee

  // formatCurrency
  const formattedDelivery = formatCurrency(deliveryFee, "GHS")
  const formattedTotal = formatCurrency(total, "GHS")

  return (
    <div className="">
      <h2 className="text-lg font-semibold divide-y-4 divide-black ">
        Order Summary
      </h2>
      <Separator className="my-3 h-0.5" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400/80">Subtotal</p>
          <p className="text-sm">{formatCurrency(cartTotal, "GHS")}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400/80">Delivery</p>
          <p className="text-sm">{formattedDelivery}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400/80">Total</p>
          <p className="text-xl font-bold">{formattedTotal}</p>
        </div>
      </div>
    </div>
  )
}

export default BasketOrderSummery
