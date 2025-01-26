"use client"
import { useCartStore } from "@/store"
import React from "react"

type AddButtonProps = {
  product: {
    id: string
    quantity: number
  }
  variantId: string
  isCheckout?: boolean
}

const AddButton: React.FC<AddButtonProps> = ({
  product,
  variantId,
  isCheckout,
}) => {
  const { cart, updateCartItem, removeFromCart } = useCartStore()

  // Find the existing cart item for this variant
  const existingCartItem = cart.find((item) => item.variantId === variantId)
  const quantity = existingCartItem?.quantity || 0

  // Handle Quantity Change
  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      updateCartItem(variantId, -1)
    } else if (type === "d" && quantity === 1) {
      removeFromCart(variantId)
    } else if (type === "i" && quantity < product?.quantity) {
      updateCartItem(variantId, 1)
    }
  }

  return (
    <div className="py-2 lg:px-4 px-2 border border-l-slate-200 rounded-full flex items-center justify-between w-28 min-w-32 lg:w-36">
      <button
        className="cursor-pointer border flex justify-center items-center border-slate-300 rounded-full h-7 w-7 text-xl disabled:cursor-not-allowed disabled:opacity-20"
        onClick={(e) => {
          e.preventDefault()
          handleQuantity("d")
        }}
        disabled={quantity <= 0} // Prevent decrement below 0
      >
        -
      </button>
      {quantity}
      <button
        className="cursor-pointer border flex justify-center items-center border-slate-300 rounded-full h-7 w-7 text-xl disabled:cursor-not-allowed disabled:opacity-20"
        onClick={(e) => {
          e.preventDefault()
          handleQuantity("i")
        }}
        disabled={quantity >= product?.quantity} // Prevent increment beyond stock
      >
        +
      </button>
    </div>
  )
}

export default AddButton
