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
  const cart = useCartStore((state) => state.cart)

  const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)

  const router = useRouter()

  const handleClearCart = () => {
    clearCart()
    setDeliveryFee(0)
    router.push("/")
  }

  return (
    <div className="w-full p-4 md:p-10 md:max-w-7xl mx-auto bg-white">
      <div className="flex flex-col">
        <div className="flex items-center space-x-2 mb-2">
          <ShoppingCartIcon className="h-8 w-8 md:h-10 md:w-10" />
          <h1 className="text-2xl md:text-3xl font-bold">Your Shopping Cart</h1>
        </div>
        {cart.length > 0 ? (
          <p className="text-neutral-600/75 mb-2">
            Review the items in your cart and checkout when ready!
          </p>
        ) : (
          <p className="text-neutral-600/75 mb-2">
            You have no items in your basket!
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row lg:h-full gap-y-8 lg:gap-x-16 items-start">
        {/* Left Section */}
        <div className="flex-1 lg:flex-[2] p-4 rounded-md h-full">
          <div className="flex flex-col h-full">
            <div className="w-full flex-grow">
              <div className="overflow-y-auto scrollbar-hide w-full h-[400px] md:h-[600px]">
                <BasketItems />
              </div>
            </div>
            {/* <div className="flex items-center justify-between mt-4">
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
            </div> */}
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden lg:block lg:flex-[1] space-y-4 h-full">
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
  )
}

export default BasketPage
