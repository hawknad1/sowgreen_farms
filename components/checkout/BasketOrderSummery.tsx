"use client"
import { getCartTotal } from "@/lib/getCartTotal"
import { useCartStore, useDeliveryStore } from "@/store"
import React from "react"
import { Separator } from "../ui/separator"
import { formatCurrency } from "@/lib/utils"
import { addTax } from "@/lib/addTax"

const BasketOrderSummery = () => {
  const cart = useCartStore((state) => state.cart)
  const { deliveryFee, setDeliveryFee } = useDeliveryStore()

  const cartWithTax = cart.map((product) => ({
    ...product,
    price: addTax(product.price),
  }))
  const basketTotal = getCartTotal(cartWithTax)
  const total = parseFloat(basketTotal) + parseFloat(deliveryFee.toFixed(2))

  // formatCurrency
  const formattedDelivery = formatCurrency(deliveryFee, "GHC")
  const formattedSubTotal = formatCurrency(parseFloat(basketTotal), "GHC")
  const formattedTotal = formatCurrency(total, "GHC")

  return (
    <div className="">
      <h2 className="text-lg font-semibold divide-y-4 divide-black ">
        Order Summary
      </h2>
      <Separator className="my-3 h-0.5" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400/80">Subtotal</p>
          <p className="text-sm">{formattedSubTotal}</p>
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
