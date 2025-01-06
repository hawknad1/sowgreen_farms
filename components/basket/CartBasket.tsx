// import { formatCurrency } from "@/lib/utils"
// import { useCartStore } from "@/store"
// import { Product } from "@/types"
// import { TrashIcon } from "@heroicons/react/20/solid"
// import Image from "next/image"
// import React, { useEffect, useState } from "react"
// import { Button } from "../ui/button"
// import AddButton from "@/app/(root)/products/[productId]/AddButton"

// const CartBasket = () => {
//   const [products, setProducts] = useState<Record<string, Product>>({})
//   const [loading, setLoading] = useState(false)

//   const {
//     selectedVariant,
//     quantity,
//     setSelectedVariant,
//     setQuantity,
//     addToCart,
//     cart,
//   } = useCartStore()

//   // Function to fetch a single product by productId
//   const fetchProduct = async (id: string) => {
//     try {
//       const response = await fetch(`/api/products/${id}`)
//       if (!response.ok)
//         throw new Error(`Failed to fetch product with id: ${id}`)
//       const product = await response.json()
//       return product
//     } catch (error) {
//       console.error("Error fetching product:", error)
//       return null
//     }
//   }

//   // Fetch products for all productIds in the cart
//   const fetchProducts = async () => {
//     setLoading(true)
//     const fetchedProducts: { [id: string]: Product } = {}

//     // Fetch each product and store it in the state
//     for (const item of cart) {
//       if (!products[item.productId]) {
//         // Avoid duplicate fetches for the same product
//         const product = await fetchProduct(item.productId)
//         if (product) {
//           fetchedProducts[item.productId] = product
//         }
//       }
//     }

//     setProducts((prev) => ({ ...prev, ...fetchedProducts }))
//     setLoading(false)
//   }

//   useEffect(() => {
//     if (cart.length > 0) {
//       fetchProducts()
//     }
//   }, [cart])

//   return (
//     <div>
//       {cart.length > 0 && (
//         <div className="mt-8">
//           <div className="flex w-full justify-between px-6 text-sm text-gray-600">
//             <h2>Product</h2>
//             <h2>Price</h2>
//             <h2>Quantity</h2>
//             <h2>Subtotal</h2>
//           </div>
//           <div className="mt-4 space-y-4">
//             {cart.map((item, i) => {
//               const product = products[item.productId] // Match product by productId

//               return (
//                 <div className="p-2.5 my-2 flex items-center justify-between border border-neutral-300/55 rounded-lg">
//                   <div className="flex items-center space-x-4 cursor-pointer">
//                     <Image
//                       src={product?.imageUrl}
//                       alt={product?.title}
//                       width={80}
//                       height={80}
//                       className="h-20 w-20 object-contain"
//                     />
//                     <div>
//                       <p className="line-clamp-2 font-bold">{product?.title}</p>
//                       <div className="flex space-x-1">
//                         {/* <p className="font-medium text-neutral-400 text-sm">
//                           {formatCurrency(product.variants[i].price, "GHS")}
//                         </p> */}
//                         <>
//                           <p className="font-medium text-neutral-400 text-sm">
//                             {product?.variants[i].weight}
//                           </p>
//                           <p className="font-medium text-neutral-400 text-sm">
//                             {product?.variants[i].unit}
//                           </p>
//                         </>
//                       </div>
//                     </div>
//                   </div>
//                   <p className="font-medium text-neutral-400 text-sm">
//                     {formatCurrency(product.variants[i].price, "GHS")}
//                   </p>
//                   <AddButton product={products} />
//                   <div className="flex items-center gap-x-3">
//                     <p className="font-bold">
//                       {formatCurrency(item?.price * item?.quantity, "GHS")}
//                     </p>
//                     <button className="rounded-full w-fit h-fit p-2 hover:bg-gray-100">
//                       <TrashIcon className="h-6 w-6 text-red-500" />
//                     </button>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default CartBasket

"use client"
import { useCartStore } from "@/store"
import { Product } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { TrashIcon } from "@heroicons/react/20/solid"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import AddButton from "@/app/(root)/products/[productId]/AddButton"
import BasketCartItems from "./BasketCartItems"
import { Button } from "../ui/button"

const CartBasket = () => {
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [loading, setLoading] = useState(false)

  const { cart, cartTotal, removeFromCart, clearCart } = useCartStore()

  console.log(cart, "carttttt")
  return (
    <div>
      {cart.length > 0 && (
        <div className="mt-8">
          <div className="flex w-full justify-between px-6 text-sm text-gray-600">
            <h2>Product</h2>
            <h2 className="hidden md:inline-flex">Price</h2>
            <h2>Quantity</h2>
            <h2>Subtotal</h2>
          </div>
          <BasketCartItems />
        </div>
      )}

      <Button onClick={clearCart}>Clear basket</Button>
    </div>
  )
}

export default CartBasket
