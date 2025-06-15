// "use client"
// import Image from "next/image"
// import React from "react"
// import { useCartStore } from "@/store"
// import { formatCurrency } from "@/lib/utils"

// const CartDisplay = () => {
//   const { cartProducts, cart } = useCartStore()
//   const [isMounted, setIsMounted] = React.useState(false)

//   React.useEffect(() => {
//     setIsMounted(true)
//   }, [])

//   if (!isMounted) return null // Prevent hydration mismatch

//   if (cart.length === 0) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <h3 className="text-xl font-bold text-gray-800 mb-6">Cart Items</h3>
//         <p className="text-gray-500">Your cart is empty</p>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-white py-6">
//       <h3 className="lg:text-xl text-base font-bold text-gray-800 mb-6">
//         Cart Items
//       </h3>
//       <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//         <div className="space-y-4">
//           {cart.map((item) => {
//             const product = item.product

//             if (!product) {
//               console.error("Missing product data for:", item.productId)
//               return null // Skip rendering this item
//             }

//             return (
//               <div
//                 key={item.variantId}
//                 className="flex items-center justify-between border p-2 lg:p-4 rounded-lg "
//               >
//                 <div className="flex items-center space-x-4">
//                   <Image
//                     src={product?.images?.[0]?.url || "/placeholder-image.png"}
//                     alt={product?.title || "Product image"}
//                     width={80}
//                     height={80}
//                     className="lg:h-20 lg:w-20 h-16 w-16 object-contain bg-slate-50 rounded-lg p-1 lg:p-2"
//                   />
//                   <div>
//                     <p className="font-bold text-gray-800 text-sm lg:text-base max-w-32 lg:max-w-full line-clamp-1 lg:line-clamp-none">
//                       {product?.title || "Unnamed Product"}
//                     </p>
//                     <div className="text-xs lg:text-sm text-gray-600/65 flex items-center">
//                       <p>
//                         {formatCurrency(item?.price || 0, "GHS")}
//                         {item?.weight === 0 || item?.weight === null ? (
//                           ""
//                         ) : (
//                           <span className="lg:text-sm text-xs text-neutral-400">{` / ${
//                             item?.weight < 1
//                               ? item?.weight * 1000
//                               : item?.weight
//                           }${item?.unit}`}</span>
//                         )}{" "}
//                       </p>

//                       {/* <p className="text-gray-500">x {item?.quantity || 0}</p> */}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="lg:text-sm text-xs text-gray-600">
//                     QTY: {item?.quantity || 0}
//                   </p>
//                   <div className="flex-col sm:inline-flex gap-x-1.5">
//                     <p className="text-gray-600 lg:text-sm text-xs">
//                       Subtotal:
//                     </p>
//                     <p className="font-bold text-gray-800 lg:text-sm text-xs">
//                       {formatCurrency(
//                         (item?.price || 0) * (item?.quantity || 0),
//                         "GHS"
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CartDisplay

"use client"
import Image from "next/image"
import React from "react"
import { useCartStore } from "@/store"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const CartDisplay = () => {
  const { cart } = useCartStore()
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            <Skeleton className="h-20 w-20 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Cart</h3>
        <p className="text-gray-500">Your basket is currently empty.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
          }
        `}</style>

        <div className="space-y-3">
          {cart.map((item) => {
            const product = item.product

            if (!product) {
              console.error("Missing product data for:", item.productId)
              return null
            }

            return (
              <div
                key={item.variantId}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 sm:p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={product?.images?.[0]?.url || "/placeholder-image.png"}
                    alt={product?.title || "Product image"}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-contain bg-white rounded-lg p-1 border border-gray-200"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">
                    {product?.title || "Unnamed Product"}
                  </h4>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>
                      {formatCurrency(item?.price || 0, "GHS")}
                      {item?.weight === 0 || item?.weight === null ? (
                        ""
                      ) : (
                        <span className="text-xs text-gray-400">{` / ${
                          item?.weight < 1 ? item?.weight * 1000 : item?.weight
                        }${
                          item?.unit === "kg" && item.weight < 1
                            ? "g"
                            : item?.unit
                        }`}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex justify-between sm:flex-col sm:items-end gap-2 sm:gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <p className="text-sm text-gray-600">
                    QTY:{" "}
                    <span className="font-medium">{item?.quantity || 0}</span>
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatCurrency(
                      (item?.price || 0) * (item?.quantity || 0),
                      "GHS"
                    )}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CartDisplay

// // CartDisplay.tsx
// "use client"
// import Image from "next/image"
// import React from "react"
// import { useCartStore } from "@/store"
// import { formatCurrency } from "@/lib/utils"

// const CartDisplay = () => {
//   const { cart } = useCartStore()
//   const [isMounted, setIsMounted] = React.useState(false)

//   React.useEffect(() => {
//     setIsMounted(true)
//   }, [])

//   if (!isMounted) return null

//   if (cart.length === 0) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
//         <h3 className="text-xl font-bold text-gray-800 mb-6">Cart Items</h3>
//         <p className="text-gray-500">Your basket is currently empty.</p>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
//       <h3 className="text-xl font-bold text-gray-800 mb-6 sr-only">
//         Items in Your Basket{" "}
//         {/* Hidden as main page has a H3, but good for accessibility */}
//       </h3>
//       <div className="max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
//         {" "}
//         {/* Increased max-height, custom-scrollbar for better control */}
//         <style jsx>{`
//           .custom-scrollbar::-webkit-scrollbar {
//             width: 8px;
//           }
//           .custom-scrollbar::-webkit-scrollbar-track {
//             background: #f1f1f1;
//             border-radius: 4px;
//           }
//           .custom-scrollbar::-webkit-scrollbar-thumb {
//             background: #cbd5e1; /* gray-300 */
//             border-radius: 4px;
//           }
//           .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//             background: #a0aec0; /* gray-400 */
//           }
//         `}</style>
//         <div className="space-y-4 sm:space-y-5">
//           {" "}
//           {/* Increased space-y for more vertical separation */}
//           {cart.map((item) => {
//             const product = item.product

//             if (!product) {
//               console.error("Missing product data for:", item.productId)
//               return null
//             }

//             return (
//               <div
//                 key={item.variantId}
//                 className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-100 p-3 sm:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors gap-3" // Added flex-col for small screens, gap
//               >
//                 <div className="flex items-center space-x-4 flex-grow">
//                   {" "}
//                   {/* flex-grow to push content */}
//                   <Image
//                     src={product?.images?.[0]?.url || "/placeholder-image.png"}
//                     alt={product?.title || "Product image"}
//                     width={90} // Slightly larger image
//                     height={90}
//                     className="h-20 w-20 sm:h-24 sm:w-24 object-contain bg-white rounded-lg p-1.5 border border-gray-100 flex-shrink-0"
//                   />
//                   <div className="flex-grow">
//                     <p className="font-bold text-gray-800 text-sm sm:text-base leading-snug line-clamp-2">
//                       {" "}
//                       {/* line-clamp-2 for longer titles */}
//                       {product?.title || "Unnamed Product"}
//                     </p>
//                     <div className="text-xs sm:text-sm text-gray-600 mt-1">
//                       <p>
//                         {formatCurrency(item?.price || 0, "GHS")}
//                         {item?.weight === 0 || item?.weight === null ? (
//                           ""
//                         ) : (
//                           <span className="text-xs sm:text-sm text-gray-400">{` / ${
//                             item?.weight < 1
//                               ? item?.weight * 1000
//                               : item?.weight
//                           }${
//                             item?.unit === "kg" && item.weight < 1
//                               ? "g"
//                               : item?.unit
//                           }`}</span>
//                         )}{" "}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex justify-between sm:flex-col sm:items-end w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
//                   {" "}
//                   {/* Responsive ordering and border */}
//                   <p className="text-gray-600 text-xs sm:text-sm mb-1">
//                     QTY:{" "}
//                     <span className="font-semibold">{item?.quantity || 0}</span>
//                   </p>
//                   <div className="flex flex-col items-end">
//                     <p className="text-gray-600 text-xs sm:text-sm">
//                       Item Total:
//                     </p>{" "}
//                     {/* Changed 'Subtotal' to 'Item Total' for clarity */}
//                     <p className="font-bold text-gray-800 text-sm sm:text-base">
//                       {formatCurrency(
//                         (item?.price || 0) * (item?.quantity || 0),
//                         "GHS"
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CartDisplay
