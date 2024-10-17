"use client"
import React from "react"
import { useCartStore } from "@/store"
import { Button } from "../ui/button"
import { Product } from "@/types"

interface RemoveFromCartProps {
  product: Product
  weight: number // Add weight as a prop
}

const RemoveFromCart = ({ product, weight }: RemoveFromCartProps) => {
  const removeFromCart = useCartStore((state) => state.removeFromCart)

  const handleRemove = () => {
    console.log("removing from cart", product.id, "with weight", weight)
    removeFromCart({ ...product }) // Pass weight along with product
  }

  return (
    <Button onClick={handleRemove} className="h-8 w-8">
      -
    </Button>
  )
}

export default RemoveFromCart
