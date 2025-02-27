"use client"
import React from "react"

import {
  useCartStore,
  useDeliveryStore,
  useOrderDataStore,
  useUserStore,
} from "@/store"
import { Separator } from "../ui/separator"
import { formatCurrency } from "@/lib/utils"
import { deductBalance } from "@/lib/actions/deductBalance"

const BasketOrderSummery = () => {
  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const { ordersData } = useOrderDataStore()
  const { cartTotal } = useCartStore()
  const { user } = useUserStore()

  const total = cartTotal + deliveryFee

  const {
    updatedBalance,
    updatedOrderTotal,
    remainingAmount,
    proceedToPaystack,
  } = deductBalance(user?.user?.balance, total)

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
        {user?.user?.balance > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400/80">Credit Bal.</p>
            <p className="text-sm">
              {formatCurrency(user?.user?.balance, "GHS")}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400/80">Total</p>
          {user?.user?.balance > 0 ? (
            <p className="text-xl font-bold">
              {formatCurrency(remainingAmount, "GHS")}
              <span className="line-through font-normal text-base text-neutral-400 ml-2">
                {formattedTotal}
              </span>
            </p>
          ) : (
            <p className="text-xl font-bold">{formattedTotal}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BasketOrderSummery
