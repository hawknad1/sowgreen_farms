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
      <h3 className="lg:text-xl text-base font-bold text-gray-800 mb-6">
        Cart Items
      </h3>
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="space-y-4">
          {cart.map((item) => {
            const product = item.product

            if (!product) {
              console.error("Missing product data for:", item.productId)
              return null // Skip rendering this item
            }

            return (
              <div
                key={item.variantId}
                className="flex items-center justify-between border p-2 lg:p-4 rounded-lg "
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={product?.images?.[0]?.url || "/placeholder-image.png"}
                    alt={product?.title || "Product image"}
                    width={80}
                    height={80}
                    className="lg:h-20 lg:w-20 h-16 w-16 object-contain bg-slate-50 rounded-lg p-1 lg:p-2"
                  />
                  <div>
                    <p className="font-bold text-gray-800 text-sm lg:text-base max-w-32 lg:max-w-full line-clamp-1 lg:line-clamp-none">
                      {product?.title || "Unnamed Product"}
                    </p>
                    <div className="text-xs lg:text-sm text-gray-600/65 flex items-center">
                      <p>
                        {formatCurrency(item?.price || 0, "GHS")}
                        {item?.weight === 0 || item?.weight === null ? (
                          ""
                        ) : (
                          <span className="lg:text-sm text-xs text-neutral-400">{` / ${
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
                  <p className="lg:text-sm text-xs text-gray-600">
                    QTY: {item?.quantity || 0}
                  </p>
                  <div className="flex-col sm:inline-flex gap-x-1.5">
                    <p className="text-gray-600 lg:text-sm text-xs">
                      Subtotal:
                    </p>
                    <p className="font-bold text-gray-800 lg:text-sm text-xs">
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
