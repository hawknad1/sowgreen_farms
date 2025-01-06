// "use client"
// import React from "react"
// import { useCartStore } from "@/store"
// import { Button } from "../ui/button"
// import { Product, Variant } from "@/types"

// // interface RemoveFromCartProps {
// //   product: Product
// //   weight: number // Add weight as a prop
// // }
// interface RemoveFromCartProps {
//   product: Product
//   variant: Variant
// }

// const RemoveFromCart = ({ product, variant }: RemoveFromCartProps) => {
//   const removeFromCart = useCartStore((state) => state.removeFromCart)

//   const handleRemove = () => {
//     console.log("removing from cart", product.id, "with weight", variant)
//     removeFromCart({ ...product }) // Pass weight along with product
//   }

//   return (
//     <Button onClick={handleRemove} className="h-8 w-8">
//       -
//     </Button>
//   )
// }

// export default RemoveFromCart

import React from "react"

const RemoveFromCart = () => {
  return <div>RemoveFromCart</div>
}

export default RemoveFromCart
