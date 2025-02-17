"use client"

import React from "react"
import BasketOrderSummery from "@/components/checkout/BasketOrderSummery"
import CheckoutBox from "@/components/checkout/CheckoutBox"
import Coupon from "@/components/checkout/Coupon"
import PaymentMethod from "@/components/checkout/PaymentMethod"
import CartBasket from "@/components/basket/CartBasket"

import { ShoppingCartIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import { useCartStore, useDeliveryStore } from "@/store"
import { Button } from "@/components/ui/button"

const BasketPage = () => {
  const clearCart = useCartStore((state) => state.clearCart)
  const router = useRouter()
  const cart = useCartStore((state) => state.cart)
  const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)
  const { cartItemCount } = useCartStore()

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
          <h1 className="text-lg lg:text-2xl md:text-3xl font-bold">
            Your Shopping Cart
          </h1>
        </div>
        {cart.length > 0 ? (
          <p className="text-neutral-600/75 mb-2 text-sm md:text-base">
            Review the items in your cart and checkout when ready!
          </p>
        ) : (
          <p className="text-neutral-600/75 mb-2 text-sm md:text-base">
            You have no items in your basket!
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-8 lg:gap-x-20">
        {/* Left Section */}

        <div className="w-full lg:col-span-2 col-span-1">
          <div className="overflow-y-auto scrollbar-sowgreen scrollbar-hide">
            <CartBasket />
          </div>
          {cartItemCount > 0 && (
            <div className={`mt-4 hidden lg:inline-flex`}>
              <Button
                className="w-fit"
                variant="destructive"
                onClick={handleClearCart}
              >
                Clear basket
              </Button>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="w-full grid gap-3 md:mt-0 col-span-1">
          <CheckoutBox className="hidden lg:inline-flex ">
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
