"use client"
import Image from "next/image"
import React from "react"
import groupById from "@/lib/groupById"

import { getCartTotal } from "@/lib/getCartTotal"
import { useCartStore } from "@/store"

const CartDisplay = () => {
  const cart = useCartStore((state) => state.cart)
  const grouped = groupById(cart)

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Cart Items</h3>
      <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
        <ul className="divide-y divide-neutral-200">
          {Object.keys(grouped).map((id) => {
            const items = grouped[id]
            const item = items[0]
            const total = getCartTotal(items)
            const quantity = items.length

            return (
              <li
                key={id}
                className="flex items-center justify-between gap-x-4 px-2 py-4 mb-2"
              >
                <div className="flex items-center w-full">
                  <div className="bg-gray-50 rounded-md p-2">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="h-16 w-16 object-contain rounded-md"
                      />
                    )}
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col flex-grow ml-4">
                      <p className="text-sm font-semibold line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity: {quantity}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-sm font-bold mt-1">GHC {total}</p>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default CartDisplay
