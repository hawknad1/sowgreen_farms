"use client"
import React from "react"
import { formatCurrency } from "@/lib/utils"
import { useCartStore, useUserStore } from "@/store"
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

  const total = cartTotal + deliveryFee
  const subtotal = formatCurrency(cartTotal, "GHS")
  const formattedDelivery = formatCurrency(deliveryFee, "GHS")
  const formattedTotal = formatCurrency(total, "GHS")

  const {
    updatedBalance,
    updatedOrderTotal,
    remainingAmount,
    proceedToPaystack,
  } = deductBalance(user?.user?.balance, total)

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
            <p className="text-sm  md:text-base text-neutral-500">Subtotal</p>
            <p className="font-semibold text-sm">{subtotal}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm  md:text-base text-neutral-500">Delivery</p>
            <p className="font-semibold text-sm">{formattedDelivery}</p>
          </div>
          {user?.user?.balance > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm  md:text-base text-neutral-500">
                Credit Bal.
              </p>
              <p className="font-semibold text-sm">
                {formatCurrency(user?.user.balance, "GHS")}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between text-lg">
            <p className="text-sm  md:text-base text-neutral-500">Total</p>
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
    </div>
  )
}

export default OrderSummary
