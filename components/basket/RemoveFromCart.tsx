"use client"
import React from "react"
import { useCartStore } from "@/store"
import { Button } from "../ui/button"
import { Product } from "@/types"

const RemoveFromCart = ({ product }: { product: Product }) => {
  const removeFromCart = useCartStore((state) => state.removeFromCart)

  const handleRemove = () => {
    console.log("removing from cart", product.id)
    removeFromCart(product)
  }
  return (
    <Button onClick={handleRemove} className="h-8 w-8">
      -
    </Button>
  )
}

export default RemoveFromCart
