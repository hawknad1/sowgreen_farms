"use client"
import AddToCart from "@/components/basket/AddToCart"
import { addTax } from "@/lib/addTax"
import { getCartTotal } from "@/lib/getCartTotal"
import groupById from "@/lib/groupById"
import { useCartStore } from "@/store"
import Image from "next/image"
import React from "react"

const OrderSummary = () => {
  const cart = useCartStore((state) => state.cart)
  const grouped = groupById(cart)
  const cartWithTax = cart.map((product) => ({
    ...product,
    price: addTax(product.price),
  }))
  const basketTotal = getCartTotal(cartWithTax)

  return (
    <div className="flex flex-col justify-between h-fit rounded-md  ">
      <div className="overflow-y-auto overflow-scroll max-h-[400px] scrollbar-hide">
        <ul className="divide-y divide-neutral-200">
          {Object.keys(grouped).map((id) => {
            const item = grouped[id][0]
            const total = getCartTotal(grouped[id])
            const taxedItem = addTax(parseFloat(total))

            return (
              <li
                key={id}
                className="flex items-center justify-between gap-x-4 px-2 py-4 bg-gray-50 rounded-md shadow-sm mb-2 w-full"
              >
                <div className="flex items-center justify-between space-x-4 w-full">
                  <div>
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="lg:h-16 lg:w-16 h-12 w-12 object-contain rounded-md"
                      />
                    )}
                  </div>

                  <div className="flex flex-col flex-grow">
                    <p className="text-sm lg:text-base font-semibold line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-sm lg:text-base font-bold">
                      {taxedItem.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <AddToCart product={item} />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="bg-white flex flex-col py-4 border-t border-neutral-200">
        <div className="flex flex-col space-y-4 ">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-500">Subtotal</p>
            <p className="font-semibold text-sm">{basketTotal}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-500">Shipping</p>
            <p className="font-semibold text-sm">GHC 0.00</p>
          </div>
          <div className="flex items-center justify-between font-semibold text-lg">
            <p className="text-sm text-neutral-500">Total</p>
            <p className="text-lg">{basketTotal}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
