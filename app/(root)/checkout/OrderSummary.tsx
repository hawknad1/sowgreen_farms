"use client"
import React from "react"
import { formatCurrency } from "@/lib/utils"
import { useCartStore, useUserListStore, useUserStore } from "@/store"
import BasketCartItems from "@/components/basket/BasketCartItems"
import { useSession } from "next-auth/react"
import { deductBalance } from "@/lib/actions/deductBalance"

const OrderSummary = ({
  selectedPickupOption,
  selectedDeliveryMethod,
  deliveryFee,
}: {
  selectedPickupOption: string
  selectedDeliveryMethod: string
  deliveryFee: number
}) => {
  const { cartTotal } = useCartStore()
  const { user } = useUserStore()
  const { balance } = useUserListStore()

  const total = cartTotal + deliveryFee
  const subtotal = formatCurrency(cartTotal, "GHS")
  const formattedDelivery = formatCurrency(deliveryFee, "GHS")
  const formattedTotal = formatCurrency(total, "GHS")

  const {
    updatedBalance,
    updatedOrderTotal,
    remainingAmount,
    proceedToPaystack,
  } = deductBalance(balance, total)

  return (
    <div className="flex flex-col justify-between h-fit rounded-md">
      <div className="overflow-y-auto max-h-[400px] scrollbar-hide">
        <div className="flex items-center">
          <BasketCartItems isCheckout={true} />
        </div>
      </div>
      <div className="bg-white flex flex-col py-4 border-t border-neutral-200">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm  md:text-base text-neutral-500 font-medium">
              Subtotal
            </p>
            <p className="font-semibold text-sm">{subtotal}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm  md:text-base text-neutral-500 font-medium">
              Delivery Fee
            </p>
            <p className="font-semibold text-sm">{formattedDelivery}</p>
          </div>
          <div
            className={`flex items-center justify-between ${
              user?.user?.balance < 0
                ? "bg-red-500/15 text-red-500 py-1 rounded-sm font-medium px-2"
                : user?.user?.balance >= 0
                ? "text-emerald-500 bg-emerald-500/15 border-emerald-300/15 py-1 rounded-sm font-medium px-2"
                : ""
            }`}
          >
            <p
              className={`text-sm md:text-base  ${
                balance < 0
                  ? "text-red-500"
                  : balance >= 0
                  ? "text-emerald-500"
                  : "text-zinc-400/80"
              } `}
            >
              Credit Bal.
            </p>
            <p className="font-semibold text-sm">
              {formatCurrency(balance, "GHS")}
            </p>
          </div>
          <div className="flex items-center justify-between text-lg">
            <p className="text-sm  md:text-base text-neutral-500 font-medium">
              Total
            </p>
            <span className="font-semibold text-sm">{formattedTotal}</span>
          </div>
          {balance > 0 ||
            (balance < 0 && (
              <div className="flex items-center justify-between text-lg">
                <>
                  <p className="text-sm  md:text-base text-red-500 font-bold">
                    Total Due
                  </p>
                  <p className="text-xl font-bold text-red-500">
                    {formatCurrency(updatedOrderTotal, "GHS")}
                  </p>
                </>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
