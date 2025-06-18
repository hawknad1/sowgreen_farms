"use client"
import AddButton from "@/app/(root)/products/[productId]/AddButton"
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

const BasketCartItemsPopover = ({ isCheckout }: BasketCartItemsProps) => {
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

export default BasketCartItemsPopover
