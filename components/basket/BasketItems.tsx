"use client"
import { getCartTotal } from "@/lib/getCartTotal"
import groupById from "@/lib/groupById"
import { useCartStore, useDeliveryStore } from "@/store"
import Image from "next/image"
import React, { useState } from "react"
import AddToCart from "./AddToCart"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { addTax } from "@/lib/addTax"
import { formatCurrency } from "@/lib/utils"

const BasketItems = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { deliveryFee, setDeliveryFee } = useDeliveryStore()
  const cart = useCartStore((state) => state.cart)
  const grouped = groupById(cart)
  const router = useRouter()
  const cartWithTax = cart.map((product) => ({
    ...product,
    price: addTax(product.price),
  }))
  const basketTotal = getCartTotal(cartWithTax)

  return (
    <div className="w-full">
      <ul className="w-full">
        {Object.keys(grouped).map((id) => {
          const item = grouped[id][0]
          const total = getCartTotal(grouped[id])
          const taxedItem = addTax(parseInt(total))

          return (
            <li
              key={id}
              className="p-2.5 my-2 flex items-center justify-between border border-neutral-300/55 rounded-lg"
            >
              <div
                onClick={() => router.push(`/products/${item.id}`)}
                className="flex items-center space-x-4 cursor-pointer "
              >
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-contain"
                  />
                )}
                <div>
                  <p className="line-clamp-2 font-bold">{item.title}</p>
                  <div
                    dangerouslySetInnerHTML={{ __html: item.description }}
                    className="line-clamp-2 font-light text-sm mt-2 max-w-lg"
                  />
                </div>
              </div>

              <div className="flex flex-col border rounded-md p-2 lg:p-3.5">
                <AddToCart product={item} />
                <p className="mt-4 font-bold text-center">
                  {formatCurrency(taxedItem, "GHS")}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="flex flex-col lg:hidden justify-end p-5">
        <p className="font-bold text-xl lg:text-2xl text-right mb-5">
          Total: {basketTotal}
        </p>
        <Button onClick={() => router.push("/checkout")}>Checkout</Button>
      </div>
    </div>
  )
}

export default BasketItems
