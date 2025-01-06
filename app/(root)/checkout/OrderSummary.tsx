import React from "react"
import { formatCurrency } from "@/lib/utils"
import { useCartStore } from "@/store"
import BasketCartItems from "@/components/basket/BasketCartItems"

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

  const total = cartTotal + deliveryFee
  const subtotal = formatCurrency(cartTotal, "GHS")
  const formattedDelivery = formatCurrency(deliveryFee, "GHS")
  const formattedTotal = formatCurrency(total, "GHS")

  return (
    <div className="flex flex-col justify-between h-fit rounded-md">
      <div className="overflow-y-auto max-h-[400px] scrollbar-hide">
        <div className="flex items-center">
          <BasketCartItems isCheckout={true} />
        </div>
      </div>
      <div className="bg-white flex flex-col py-4 border-t border-neutral-200">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-500">Subtotal</p>
            <p className="font-semibold text-sm">{subtotal}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-500">Delivery</p>
            <p className="font-semibold text-sm">{formattedDelivery}</p>
          </div>
          <div className="flex items-center justify-between font-semibold text-lg">
            <p className="text-sm text-neutral-500">Total</p>
            <p className="text-lg">{formattedTotal}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
