"use client"
import React from "react"
import BasketCartItems from "./BasketCartItems"

import { useCartStore } from "@/store"
import { Button } from "../ui/button"

const CartBasket = () => {
  const { cart, clearCart } = useCartStore()

  return (
    <div className="h-screen flex flex-col justify-between">
      <>
        {cart.length > 0 && (
          <div className="mt-8">
            <div className="flex w-full justify-between px-6 text-sm text-gray-600">
              <h2>Product</h2>
              <h2>Quantity</h2>
              <h2>Subtotal</h2>
            </div>
            <BasketCartItems />
          </div>
        )}
      </>

      <Button className="w-fit" variant="destructive" onClick={clearCart}>
        Clear basket
      </Button>
    </div>
  )
}

export default CartBasket
