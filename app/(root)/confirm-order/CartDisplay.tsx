// "use client"
// import Image from "next/image"
// import React from "react"

// import { useCartStore } from "@/store"
// import { formatCurrency } from "@/lib/utils"

// const CartDisplay = () => {
//   const { cartProducts, cart } = useCartStore()

//   return (
//     <div className="bg-white rounded-md shadow-sm p-4">
//       <h3 className="text-lg font-semibold text-gray-700 mb-4">Cart Items</h3>
//       <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
//         <div className="mt-4 space-y-4 w-full">
//           {cart.map((item) => {
//             const product = cartProducts[item.productId]
//             const variant = product?.variants.find(
//               (v) => v.id === item.variantId
//             )

//             return (
//               <div
//                 key={item.variantId}
//                 className={`my-2 flex items-center justify-between border p-2.5
//                 border-neutral-300/55 rounded-lg`}
//               >
//                 <div className={"flex items-center space-x-4 cursor-pointer"}>
//                   <Image
//                     src={product?.imageUrl || product?.images[0]?.url}
//                     alt={product?.title}
//                     width={80}
//                     height={80}
//                     className={
//                       "h-20 w-20 object-contain bg-slate-50 rounded-md p-1"
//                     }
//                   />
//                   <div>
//                     <>
//                       <p className="line-clamp-2 font-bold">{product?.title}</p>
//                       <div className="flex flex-col items-start ">
//                         <p className="text-sm font-medium">
//                           {formatCurrency(variant?.price, "GHS")}
//                         </p>
//                         <p className="text-sm font-light text-neutral-500">
//                           x {item?.quantity}
//                         </p>
//                         <div className="flex items-center">
//                           <p className="font-medium text-neutral-400 text-sm">
//                             {variant?.weight}
//                           </p>
//                           <p className="font-medium text-neutral-400 text-sm">
//                             {variant?.unit}
//                           </p>
//                         </div>
//                       </div>
//                     </>
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-neutral-600">Subtotal</p>
//                   <p className={"font-medium flex text-neutral-400 text-sm"}>
//                     {formatCurrency(item?.price * item?.quantity, "GHS")}
//                   </p>
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

const CartDisplay = () => {
  const { cartProducts, cart } = useCartStore()
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null // Prevent hydration mismatch

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Cart Items</h3>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="bg-white py-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Cart Items</h3>
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="space-y-4">
          {cart.map((item) => {
            // const product = cartProducts[item.productId]
            // const variant = product?.variants?.find(
            //   (v) => v.id === item.variantId
            // )

            const product = item.product

            console.log(item, "item")

            if (!product) {
              console.error("Missing product data for:", item.productId)
              return null // Skip rendering this item
            }

            return (
              <div
                key={item.variantId}
                className="flex items-center justify-between border p-4 rounded-lg "
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={product?.images?.[0]?.url || "/placeholder-image.png"}
                    alt={product?.title || "Product image"}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-contain bg-slate-50 rounded-lg p-2"
                  />
                  <div>
                    <p className="font-bold text-gray-800">
                      {product?.title || "Unnamed Product"}
                    </p>
                    <div className="text-sm text-gray-600/65 flex items-center">
                      <p>
                        {formatCurrency(item?.price || 0, "GHS")}
                        {item?.weight === 0 || item?.weight === null ? (
                          ""
                        ) : (
                          <span className="text-sm text-neutral-400">{` / ${
                            item?.weight < 1
                              ? item?.weight * 1000
                              : item?.weight
                          }${item?.unit}`}</span>
                        )}{" "}
                      </p>

                      {/* <p className="text-gray-500">x {item?.quantity || 0}</p> */}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    QTY: {item?.quantity || 0}
                  </p>
                  <div className="flex-col sm:inline-flex gap-x-1.5">
                    <p className="text-gray-600">Subtotal:</p>
                    <p className="font-bold text-gray-800">
                      {formatCurrency(
                        (item?.price || 0) * (item?.quantity || 0),
                        "GHS"
                      )}
                    </p>
                  </div>
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
