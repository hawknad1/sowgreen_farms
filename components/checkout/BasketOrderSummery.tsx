"use client"
import React from "react"

import {
  useCartStore,
  useDeliveryStore,
  useOrderDataStore,
  useUserListStore,
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
  const { balance } = useUserListStore()

  const total = cartTotal + deliveryFee

  console.log(balance, "balance---basket")

  const {
    updatedBalance,
    updatedOrderTotal,
    remainingAmount,
    proceedToPaystack,
  } = deductBalance(balance, total)

  console.log(updatedOrderTotal, "updatedOrderTotal--basket")
  // formatCurrency
  const formattedDelivery = formatCurrency(deliveryFee, "GHS")
  const formattedTotal = formatCurrency(total, "GHS")

  return (
    <div className="">
      <h2 className="text-lg font-semibold divide-y-4 divide-black">
        Order Summary
      </h2>
      <Separator className="my-3 h-0.5" />
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-zinc-400/80">Subtotal</p>
          <p className="text-sm">{formatCurrency(cartTotal, "GHS")}</p>
        </div>
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-zinc-400/80">Delivery Fee</p>
          <p className="text-sm">{formattedDelivery}</p>
        </div>

        <div
          className={`flex items-center justify-between ${
            balance < 0
              ? "bg-red-500/15 text-red-500 py-1 rounded-sm font-medium px-2"
              : balance >= 0
              ? "text-emerald-500 bg-emerald-500/15 border-emerald-300/15 py-1 rounded-sm font-medium px-2"
              : ""
          }`}
        >
          <p
            className={`text-sm  ${
              balance < 0
                ? "text-red-500"
                : balance >= 0
                ? "text-emerald-500"
                : "text-zinc-400/80"
            } `}
          >
            Credit Bal.
          </p>
          <p className="text-sm">{formatCurrency(balance, "GHS")}</p>
        </div>

        <div className="flex items-center justify-between px-2">
          <p className="text-sm font-bold">Total</p>
          <p className="text-sm font-bold">{formattedTotal}</p>
        </div>

        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-red-500 font-semibold">Total Due</p>
          <p className="text-sm text-red-500 font-semibold">
            {formatCurrency(updatedOrderTotal, "GHS")}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BasketOrderSummery
