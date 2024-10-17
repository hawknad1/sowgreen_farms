"use client"
import CheckoutBox from "@/components/checkout/CheckoutBox"
import Coupon from "@/components/checkout/Coupon"
import PaymentMethod from "@/components/checkout/PaymentMethod"
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"

import { ShoppingCartIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import React from "react"
import BasketItems from "@/components/basket/BasketItems"
import BasketOrderSummery from "@/components/checkout/BasketOrderSummery"
import { useCartStore, useDeliveryStore } from "@/store"

const BasketPage = () => {
  const clearCart = useCartStore((state) => state.clearCart)
  const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)

  const router = useRouter()

  const handleClearCart = () => {
    clearCart()
    setDeliveryFee(0)
    router.push("/")
  }

  return (
    <div className="w-full p-10 max-w-7xl mx-auto bg-white">
      <div className="flex items-start gap-x-3">
        <div className="flex-1">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <ShoppingCartIcon className="h-10 w-10" />
              <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
            </div>
            <p className="mt-2">
              Review the items in your cart and checkout when ready!
            </p>
          </div>
          <div className="flex items-center justify-between ">
            <div className="mt-8 w-full">
              <div className="overflow-scroll scrollbar-hide w-full h-[600px]">
                <BasketItems />
              </div>
              <div className="hidden lg:inline-flex items-center gap-4 mt-8">
                <div
                  onClick={() => router.back()}
                  className="flex items-center cursor-pointer"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  <p className="text-sm font-semibold">Back</p>
                </div>
                <Button onClick={handleClearCart} variant="destructive">
                  Cancel Order
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="lg:flex items-center">
            <div className="hidden lg:flex flex-col gap-4 mt-5">
              <CheckoutBox>
                <Coupon />
              </CheckoutBox>
              <CheckoutBox>
                <BasketOrderSummery />
              </CheckoutBox>
              <CheckoutBox>
                <PaymentMethod />
              </CheckoutBox>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasketPage
