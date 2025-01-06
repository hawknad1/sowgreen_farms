// // "use client"
// // import { getCartTotal } from "@/lib/getCartTotal"
// // import groupById from "@/lib/groupById"
// // import { useCartStore, useDeliveryStore } from "@/store"
// // import Image from "next/image"
// // import React, { useState } from "react"
// // import AddToCart from "./AddToCart"
// // import { Button } from "../ui/button"
// // import { useRouter } from "next/navigation"
// // import { addTax } from "@/lib/addTax"
// // import { formatCurrency } from "@/lib/utils"
// // import { ChevronLeftIcon } from "lucide-react"

// // const BasketItems = () => {
// //   const [isLoading, setIsLoading] = useState(false)
// //   const { deliveryFee, setDeliveryFee } = useDeliveryStore()
// //   const clearCart = useCartStore((state) => state.clearCart)
// //   const cart = useCartStore((state) => state.cart)
// //   const grouped = groupById(cart)
// //   const router = useRouter()
// //   const cartWithTax = cart.map((product) => ({
// //     ...product,
// //     price: product.price,
// //   }))
// //   const basketTotal = getCartTotal(cartWithTax)

// //   // const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)

// //   // const router = useRouter()

// //   const handleClearCart = () => {
// //     clearCart()
// //     setDeliveryFee(0)
// //     router.push("/")
// //   }

// //   return (
// //     <div className="w-full flex flex-col justify-between h-full">
// //       <ul className="w-full">
// //         {Object.keys(grouped).map((id) => {
// //           const item = grouped[id][0]
// //           const total = getCartTotal(grouped[id])
// //           const taxedItem = total

// //           return (
// //             <li
// //               key={id}
// //               className="p-2.5 my-2 flex items-center justify-between border border-neutral-300/55 rounded-lg"
// //             >
// //               <div
// //                 onClick={() => router.push(`/products/${item.id}`)}
// //                 className="flex items-center space-x-4 cursor-pointer "
// //               >
// //                 {item.imageUrl && (
// //                   <Image
// //                     src={item.imageUrl}
// //                     alt={item.title}
// //                     width={80}
// //                     height={80}
// //                     className="h-20 w-20 object-contain"
// //                   />
// //                 )}
// //                 <div>
// //                   <p className="line-clamp-2 font-bold">{item.title}</p>
// //                   <div
// //                     dangerouslySetInnerHTML={{ __html: item.description }}
// //                     className="line-clamp-1 font-light text-sm mt-2 max-w-lg"
// //                   />
// //                 </div>
// //               </div>

// //               <div className="flex flex-col border rounded-md p-2 lg:p-3.5">
// //                 <AddToCart product={item} />
// //                 <p className="mt-4 font-bold text-center">
// //                   {formatCurrency(parseFloat(taxedItem), "GHS")}
// //                 </p>
// //               </div>
// //             </li>
// //           )
// //         })}
// //       </ul>
// //       <div>
// //         <div className="flex flex-col lg:hidden justify-end p-5">
// //           <p className="font-bold text-xl lg:text-2xl text-right mb-5">
// //             Total: {basketTotal}
// //           </p>
// //           <Button onClick={() => router.push("/checkout")}>Checkout</Button>
// //         </div>
// //         <div className="flex items-center justify-between mt-4">
// //           <div
// //             onClick={() => router.back()}
// //             className="flex items-center cursor-pointer"
// //           >
// //             <ChevronLeftIcon className="h-4 w-4" />
// //             <p className="text-sm font-semibold">Back</p>
// //           </div>
// //           <Button onClick={handleClearCart} variant="destructive">
// //             Cancel Order
// //           </Button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default BasketItems

// import { getCartTotal } from "@/lib/getCartTotal"
// import groupById from "@/lib/groupById"
// import { useCartStore, useDeliveryStore } from "@/store"
// import Image from "next/image"
// import React, { useState } from "react"
// import AddToCart from "./AddToCart"
// import { Button } from "../ui/button"
// import { useRouter } from "next/navigation"
// import { formatCurrency } from "@/lib/utils"
// import { ChevronLeftIcon } from "lucide-react"

// const BasketItems = () => {
//   const { cart, clearCart } = useCartStore((state) => ({
//     cart: state.cart,
//     clearCart: state.clearCart,
//   }))
//   const { setDeliveryFee } = useDeliveryStore()
//   const router = useRouter()

//   // Group items by product ID and calculate totals
//   const grouped = groupById(cart)
//   const basketTotal = Object.keys(grouped).reduce((total, id) => {
//     const items = grouped[id]
//     const itemTotal = items.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     )
//     return total + itemTotal
//   }, 0)

//   const handleClearCart = () => {
//     clearCart()
//     setDeliveryFee(0)
//     router.push("/")
//   }

//   return (
//     <div className="w-full flex flex-col justify-between h-full">
//       <ul className="w-full">
//         {Object.keys(grouped).map((id) => {
//           const items = grouped[id]
//           const item = items[0]
//           const total = items.reduce(
//             (sum, product) => sum + product.price * product.quantity,
//             0
//           )

//           return (
//             <li
//               key={id}
//               className="p-2.5 my-2 flex items-center justify-between border border-neutral-300/55 rounded-lg"
//             >
//               <div
//                 onClick={() => router.push(`/products/${item.id}`)}
//                 className="flex items-center space-x-4 cursor-pointer "
//               >
//                 {item.imageUrl && (
//                   <Image
//                     src={item.imageUrl}
//                     alt={item.title}
//                     width={80}
//                     height={80}
//                     className="h-20 w-20 object-contain"
//                   />
//                 )}
//                 <div>
//                   <p className="line-clamp-2 font-bold">{item.title}</p>
//                   <div
//                     dangerouslySetInnerHTML={{ __html: item.description }}
//                     className="line-clamp-1 font-light text-sm mt-2 max-w-lg"
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col border rounded-md p-2 lg:p-3.5">
//                 <AddToCart product={item} />
//                 <p className="mt-4 font-bold text-center">
//                   {formatCurrency(total, "GHS")}
//                 </p>
//               </div>
//             </li>
//           )
//         })}
//       </ul>
//       <div>
//         <div className="flex flex-col lg:hidden justify-end p-5">
//           <p className="font-bold text-xl lg:text-2xl text-right mb-5">
//             Total: {formatCurrency(basketTotal, "GHS")}
//           </p>
//           <Button onClick={() => router.push("/checkout")}>Checkout</Button>
//         </div>
//         <div className="flex items-center justify-between mt-4">
//           <div
//             onClick={() => router.back()}
//             className="flex items-center cursor-pointer"
//           >
//             <ChevronLeftIcon className="h-4 w-4" />
//             <p className="text-sm font-semibold">Back</p>
//           </div>
//           <Button onClick={handleClearCart} variant="destructive">
//             Cancel Order
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default BasketItems
import React from "react"

const BasketItems = () => {
  return <div>BasketItems</div>
}

export default BasketItems
