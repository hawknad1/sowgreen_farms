// import { Button } from "@/components/ui/button"
// import { useCartStore } from "@/store"
// import { Product } from "@/types"
// import React from "react"

// interface AddButtonProps {
//   product: Product
// }

// const AddButton = ({ product }: AddButtonProps) => {
//   const {
//     selectedVariant,
//     quantity,
//     setSelectedVariant,
//     setQuantity,
//     addToCart,
//     cart,
//   } = useCartStore()

//   const handleQuantity = (type: "i" | "d") => {
//     // Directly calculate the new quantity instead of using a functional update
//     let newQuantity = quantity
//     if (type === "d" && quantity > 1) {
//       newQuantity = quantity - 1
//     }
//     if (type === "i" && quantity < product?.quantity) {
//       newQuantity = quantity + 1
//     }
//     setQuantity(newQuantity)
//   }

//   const handleAddToCart = () => {
//     if (!selectedVariant) return

//     const existingCartItem = cart.find(
//       (item) => item.variantId === selectedVariant.id
//     )

//     if (existingCartItem) {
//       useCartStore.getState().updateCartItem(selectedVariant.id, quantity)
//     } else {
//       addToCart({
//         variantId: selectedVariant.id,
//         productId: product.id,
//         weight: selectedVariant.weight,
//         price: selectedVariant.price,
//         unit: selectedVariant.unit,
//         quantity,
//       })
//     }

//     setQuantity(1) // Reset quantity after adding to cart
//   }

//   return (
//     <div className="py-2 lg:px-4 px-2 border border-l-slate-200 rounded-full flex items-center justify-between w-28 lg:w-36">
//       <button
//         className="cursor-pointer border border-slate-300 rounded-full h-7 w-7 text-xl disabled:cursor-not-allowed disabled:opacity-20"
//         onClick={() => {
//           handleQuantity("d")
//           handleAddToCart()
//         }}
//         disabled={quantity === 1}
//       >
//         -
//       </button>
//       {quantity}
//       <button
//         className="cursor-pointer border border-slate-300 rounded-full h-7 w-7 text-xl disabled:cursor-not-allowed disabled:opacity-20"
//         onClick={() => {
//           handleQuantity("i")
//           handleAddToCart()
//         }}
//         disabled={quantity === product?.quantity}
//       >
//         +
//       </button>
//     </div>
//   )
// }

// export default AddButton

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
        className="cursor-pointer border border-slate-300 rounded-full h-7 w-7 text-xl disabled:cursor-not-allowed disabled:opacity-20"
        onClick={() => handleQuantity("d")}
        disabled={quantity <= 0} // Prevent decrement below 0
      >
        -
      </button>
      {quantity}
      <button
        className="cursor-pointer border border-slate-300 rounded-full h-7 w-7 text-xl disabled:cursor-not-allowed disabled:opacity-20"
        onClick={() => handleQuantity("i")}
        disabled={quantity >= product?.quantity} // Prevent increment beyond stock
      >
        +
      </button>
    </div>
  )
}

export default AddButton
