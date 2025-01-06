// "use client"
// import { useCartStore } from "@/store"
// import React, { useState } from "react"
// import { Button } from "../ui/button"
// import RemoveFromCart from "./RemoveFromCart"
// import { Product, Variant } from "@/types"

// interface AddToCartProps {
//   product: Product
// }

// const AddToCart = ({ product }: AddToCartProps) => {
//   const { cart, addToCart } = useCartStore((state) => ({
//     cart: state.cart,
//     addToCart: state.addToCart,
//   }))
//   const [selectedVariant, setSelectedVariant] = useState<Variant>(
//     product.variants[0]
//   )

//   // Find how many items of this product (with the same selected variant) are in the cart
//   const howManyInCart = cart.filter(
//     (item) =>
//       item.id === product.id && item.selectedVariant?.id === selectedVariant.id
//   ).length

//   const handleAdd = () => {
//     // Create a copy of the product object with the selected variant added
//     const productWithVariant = {
//       ...product,
//       selectedVariant,
//     }
//     addToCart(productWithVariant)
//   }

//   return (
//     <div className="flex items-center space-x-2">
//       <select
//         value={selectedVariant.id}
//         onChange={(e) =>
//           setSelectedVariant(
//             product.variants.find((variant) => variant.id === e.target.value)!
//           )
//         }
//         className="px-2 py-1 border border-neutral-300 rounded-md"
//       >
//         {product.variants.map((variant) => (
//           <option key={variant.id} value={variant.id}>
//             {variant.weight} {variant.unit} - {variant.price} GHS
//           </option>
//         ))}
//       </select>

//       {howManyInCart > 0 ? (
//         <>
//           <RemoveFromCart product={product} weight={selectedVariant.weight} />
//           <span className="text-sm md:text-base font-medium">
//             {howManyInCart}
//           </span>
//           <Button onClick={handleAdd} className="h-8 w-8 text-sm md:text-base">
//             +
//           </Button>
//         </>
//       ) : (
//         <Button
//           disabled={product?.isInStock === "out-of-stock"}
//           onClick={handleAdd}
//           className="px-4 py-2 text-sm md:text-base border-neutral-200"
//           variant="outline"
//         >
//           Add to cart
//         </Button>
//       )}
//     </div>
//   )
// }

// export default AddToCart

// "use client"
// import { useCartStore } from "@/store"
// import React, { useState } from "react"
// import { Button } from "../ui/button"
// import RemoveFromCart from "./RemoveFromCart"
// import { Product, Variant } from "@/types"

// interface AddToCartProps {
//   product: Product
// }

// const AddToCart = ({ product }: AddToCartProps) => {
//   const { cart, addToCart } = useCartStore((state) => ({
//     cart: state.cart,
//     addToCart: state.addToCart,
//   }))

//   const [selectedVariant, setSelectedVariant] = useState<Variant>(
//     product.variants[0] // Default to the first variant
//   )

//   // Find how many items of this product and variant are in the cart
//   const matchingItems = cart.filter(
//     (item) =>
//       item.id === product.id && item.selectedVariant?.id === selectedVariant.id
//   )
//   const quantityInCart = matchingItems.reduce(
//     (sum, item) => sum + (item.quantity || 0),
//     0
//   )

//   const handleAdd = () => {
//     // Add product with selected variant to the cart
//     addToCart({
//       ...product,
//       selectedVariant,
//       price: selectedVariant.price,
//       quantity: 1,
//     })
//   }

//   return (
//     <div className="flex items-center space-x-2">
//       {/* Variant selector */}
//       <select
//         value={selectedVariant.id}
//         onChange={(e) =>
//           setSelectedVariant(
//             product.variants.find((variant) => variant.id === e.target.value)!
//           )
//         }
//         className="px-2 py-1 border border-neutral-300 rounded-md"
//       >
//         {product.variants.map((variant) => (
//           <option key={variant.id} value={variant.id}>
//             {variant.weight} {variant.unit} - {variant.price} GHS
//           </option>
//         ))}
//       </select>

//       {quantityInCart > 0 ? (
//         <>
//           <RemoveFromCart product={product} variant={selectedVariant} />
//           <span className="text-sm md:text-base font-medium">
//             {quantityInCart}
//           </span>
//           <Button onClick={handleAdd} className="h-8 w-8 text-sm md:text-base">
//             +
//           </Button>
//         </>
//       ) : (
//         <Button
//           disabled={product?.isInStock === "out-of-stock"}
//           onClick={handleAdd}
//           className="px-4 py-2 text-sm md:text-base border-neutral-200"
//           variant="outline"
//         >
//           Add to cart
//         </Button>
//       )}
//     </div>
//   )
// }

// export default AddToCart

import React from "react"

const AddToCart = () => {
  return <div>AddToCart</div>
}

export default AddToCart
