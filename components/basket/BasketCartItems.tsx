"use client"
import AddButton from "@/app/(root)/products/[slug]/AddButton"
import Image from "next/image"

import React, { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { useCartStore } from "@/store"
import { XCircleIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/navigation"

interface BasketCartItemsProps {
  isCheckout?: boolean
  isCartIcon?: boolean
}

const BasketCartItems = ({ isCheckout }: BasketCartItemsProps) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { cart, removeFromCart } = useCartStore()

  const handleRemoveItem = (variantId: string) => {
    removeFromCart(variantId)
  }

  return (
    <div className="mt-4 space-y-4 w-full">
      {cart.map((item) => {
        const product = item.product

        return (
          <div
            key={item.variantId}
            className={`my-2 border w-full ${
              isCheckout
                ? "p-3 flex items-center justify-between"
                : "py-2 px-2 flex gap-x-4"
            } border-neutral-300/55 rounded-lg hover:shadow-sm transition-shadow duration-200`}
          >
            <div
              className={`w-full ${
                isCheckout
                  ? "flex items-center space-x-4"
                  : "sm:flex sm:items-center sm:space-x-4 lg:space-x-6 cursor-pointer"
              }`}
            >
              <Image
                src={product?.images[0]?.url}
                alt={product?.title}
                width={80}
                height={80}
                className={`${
                  isCheckout
                    ? "h-16 w-16 object-contain bg-gray-100 rounded-md py-1.5"
                    : "h-16 w-16 lg:h-20 lg:w-20 object-contain bg-gray-100 rounded-md lg:py-1.5"
                }`}
              />
              <div className="flex-1">
                {isCheckout ? (
                  <>
                    <p
                      className="line-clamp-1 font-semibold text-sm cursor-pointer hover:text-sowgren_Color transition-colors duration-200"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      {product?.title}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatCurrency(item?.price, "GHS")}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="line-clamp-1 w-full font-semibold text-sm lg:text-lg">
                      {product?.title}
                    </p>
                    <div className="md:inline-flex space-x-2 hidden mt-1">
                      {!isCheckout && (
                        <p className="text-neutral-500 text-sm">
                          {formatCurrency(item?.price || 0, "GHS")}
                        </p>
                      )}
                      {item?.weight && (
                        <>
                          <p className="text-neutral-500 text-sm">
                            / {`${item.weight}${item?.unit}`}
                          </p>
                          {/* <p className="text-neutral-500 text-sm">
                            {item?.unit}
                          </p> */}
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Add button */}
            <div
              className={`${
                isCheckout
                  ? "flex items-center justify-center"
                  : "flex items-center justify-center w-1/3"
              }`}
            >
              <AddButton
                product={product}
                variantId={item.variantId}
                isCheckout={true}
                isCartIcon={true}
              />
            </div>

            {/* Subtotal and remove cart */}
            <div
              className={`flex items-center justify-end ${
                isCheckout ? "w-fit" : "w-1/3"
              }`}
            >
              <>
                {!isCheckout && (
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm lg:text-lg">
                      {formatCurrency(item?.price * item?.quantity, "GHS")}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.variantId)}
                      className="text-xs md:hidden text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <button
                  className={`${
                    isCheckout
                      ? "p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      : "rounded-full w-fit h-fit p-2 hover:bg-gray-100 transition-colors duration-200"
                  }`}
                  onClick={() => handleRemoveItem(item.variantId)}
                >
                  <XCircleIcon
                    className={`${
                      isCheckout
                        ? "h-5 w-5 text-red-500/65"
                        : "h-6 w-6 text-red-500/65 hidden md:inline-flex"
                    }`}
                  />
                </button>
              </>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BasketCartItems

// "use client"
// import AddButton from "@/app/(root)/products/[productId]/AddButton"
// import Image from "next/image"
// import React from "react"
// import { formatCurrency } from "@/lib/utils"
// import { useCartStore } from "@/store"
// import { XMarkIcon } from "@heroicons/react/20/solid"
// import { useRouter } from "next/navigation"

// interface BasketCartItemsProps {
//   isCheckout?: boolean
//   isCartIcon?: boolean
// }

// const BasketCartItems = ({ isCheckout }: BasketCartItemsProps) => {
//   const router = useRouter()
//   const { cart, removeFromCart } = useCartStore()

//   const handleRemoveItem = (variantId: string) => {
//     removeFromCart(variantId)
//   }

//   return (
//     <>
//       {cart.map((item) => {
//         const product = item.product

//         return (
//           <div
//             key={item.variantId}
//             className={`p-4 ${
//               isCheckout ? "flex items-center" : "md:flex md:items-center"
//             }`}
//           >
//             <div
//               className={`flex ${
//                 isCheckout ? "items-center" : "md:items-center"
//               } gap-4 w-full`}
//             >
//               <div
//                 className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 cursor-pointer"
//                 onClick={() => router.push(`/products/${product.id}`)}
//               >
//                 <Image
//                   src={product?.images[0]?.url}
//                   alt={product?.title}
//                   fill
//                   className="object-contain object-center"
//                 />
//               </div>

//               <div className="flex-1">
//                 <h3
//                   className="text-base font-medium text-gray-900 hover:text-primary cursor-pointer transition-colors"
//                   onClick={() => router.push(`/products/${product.id}`)}
//                 >
//                   {product?.title}
//                 </h3>

//                 <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
//                   <p>{formatCurrency(item?.price, "GHS")}</p>
//                   {item?.weight && <p>| {`${item.weight}${item?.unit}`}</p>}
//                 </div>

//                 {/* Mobile view - quantity and remove */}
//                 <div className="mt-2 flex items-center md:hidden">
//                   <AddButton
//                     product={product}
//                     variantId={item.variantId}
//                     isCheckout={true}
//                     isCartIcon={true}
//                   />
//                   <button
//                     onClick={() => handleRemoveItem(item.variantId)}
//                     className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Desktop view - price, quantity, subtotal, remove */}
//             <div className="hidden md:flex items-center justify-between w-full mt-0">
//               <div className="w-1/5 text-center">
//                 {formatCurrency(item?.price, "GHS")}
//               </div>

//               <div className="w-1/5 flex justify-center">
//                 <AddButton
//                   product={product}
//                   variantId={item.variantId}
//                   isCheckout={true}
//                   isCartIcon={true}
//                 />
//               </div>

//               <div className="w-1/5 text-right font-medium">
//                 {formatCurrency(item?.price * item?.quantity, "GHS")}
//               </div>

//               <div className="w-10 text-right">
//                 <button
//                   onClick={() => handleRemoveItem(item.variantId)}
//                   className="text-gray-400 hover:text-red-500 transition-colors"
//                 >
//                   <XMarkIcon className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )
//       })}
//     </>
//   )
// }

// export default BasketCartItems
