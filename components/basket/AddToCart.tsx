"use client"
import { useCartStore } from "@/store"
import React from "react"
import { Button } from "../ui/button"
import RemoveFromCart from "./RemoveFromCart"
import { Product } from "@/types"

const AddToCart = ({ product }: { product: Product }) => {
  const { cart, addToCart } = useCartStore((state) => ({
    cart: state.cart,
    addToCart: state.addToCart,
  }))

  const howManyInCart = cart.filter(
    (item: Product) => item.id === product.id
  ).length

  const handleAdd = () => {
    addToCart(product)
  }

  return (
    <div className="flex items-center space-x-2">
      {howManyInCart > 0 ? (
        <>
          <RemoveFromCart product={product} />
          <span className="text-sm md:text-base font-medium">
            {howManyInCart}
          </span>
          <Button onClick={handleAdd} className="h-8 w-8 text-sm md:text-base">
            +
          </Button>
        </>
      ) : (
        <Button onClick={handleAdd} className="px-4 py-2 text-sm md:text-base">
          Add To Cart
        </Button>
      )}
    </div>
  )
}

export default AddToCart
