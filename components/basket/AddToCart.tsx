"use client"
import { useCartStore } from "@/store"
import React from "react"
import { Button } from "../ui/button"
import RemoveFromCart from "./RemoveFromCart"
import { Product } from "@/types"

interface AddToCartProps {
  product: Product
  selectedPrice?: number // Price passed from outside component
  selectedWeight?: number // Weight passed from outside component
}

const AddToCart = ({
  product,
  selectedPrice,
  selectedWeight,
}: AddToCartProps) => {
  const { cart, addToCart } = useCartStore((state) => ({
    cart: state.cart,
    addToCart: state.addToCart,
  }))

  // Find how many items of the same product and weight are in the cart
  const howManyInCart = cart.filter(
    (item: Product) => item?.id === product?.id
  ).length

  const handleAdd = () => {
    addToCart(product)
  }

  // const handleRemove = () => {
  //   removeFromCart({ ...product, weight: selectedWeight })
  // }

  return (
    <div className="flex items-center space-x-2">
      {howManyInCart > 0 ? (
        <>
          <RemoveFromCart product={product} weight={selectedWeight} />
          <span className="text-sm md:text-base font-medium">
            {howManyInCart}
          </span>
          <Button onClick={handleAdd} className="h-8 w-8 text-sm md:text-base">
            +
          </Button>
        </>
      ) : (
        <Button
          disabled={product?.isInStock === "out-of-stock"}
          onClick={handleAdd}
          className="px-4 py-2 text-sm md:text-base border-neutral-200"
          variant="outline"
        >
          Add to cart
        </Button>
      )}
    </div>
  )
}

export default AddToCart
