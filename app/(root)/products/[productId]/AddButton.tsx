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
  isCartIcon?: boolean
}

const AddButton: React.FC<AddButtonProps> = ({
  product,
  variantId,
  isCheckout,
  isCartIcon,
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
    <div
      className={`${
        isCheckout ? "py-1 px-1 w-28 " : "py-2 lg:px-4 px-2 lg:w-32 "
      }  border border-l-slate-200 rounded-full flex items-center justify-between `}
    >
      <button
        className="cursor-pointer border flex justify-center items-center outline-none border-slate-300 rounded-full h-7 w-7 text-base lg:text-xl disabled:cursor-not-allowed disabled:opacity-20"
        onClick={(e) => {
          e.preventDefault()
          handleQuantity("d")
        }}
        disabled={quantity <= 0} // Prevent decrement below 0
      >
        -
      </button>
      <p className="text-sm lg:text-base">{quantity}</p>
      <button
        className="cursor-pointer border flex justify-center outline-none items-center border-slate-300 rounded-full h-7 w-7 text-base lg:text-xl disabled:cursor-not-allowed disabled:opacity-20"
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
