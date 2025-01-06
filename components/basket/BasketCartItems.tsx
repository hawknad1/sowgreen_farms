import AddButton from "@/app/(root)/products/[productId]/AddButton"
import { formatCurrency } from "@/lib/utils"
import { useCartStore } from "@/store"
import { Product } from "@/types"
import { TrashIcon, XCircleIcon } from "@heroicons/react/20/solid"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

interface BasketCartItemsProps {
  isCheckout?: boolean
}

const BasketCartItems = ({ isCheckout }: BasketCartItemsProps) => {
  // const [cartProducts, setCartProducts] = useState<Record<string, Product>>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    cart,
    cartTotal,
    quantity,
    removeFromCart,
    setCartProducts,
    cartProducts,
  } = useCartStore()

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`)
      if (!response.ok)
        throw new Error(`Failed to fetch product with id: ${id}`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching product:", error)
      return null
    }
  }

  // const fetchProducts = async () => {
  //   setLoading(true)
  //   const fetchedProducts: { [id: string]: Product } = {}
  //   for (const item of cart) {
  //     if (!cartProducts[item.productId]) {
  //       const product = await fetchProduct(item.productId)
  //       if (product) {
  //         fetchedProducts[item.productId] = product
  //       }
  //     }
  //   }
  //   setCartProducts((prev) => ({ ...prev, ...fetchedProducts }))
  //   setLoading(false)
  // }
  const fetchProducts = async () => {
    setLoading(true)
    const fetchedProducts: { [id: string]: Product } = {}
    for (const item of cart) {
      if (!cartProducts[item.productId]) {
        const product = await fetchProduct(item.productId)
        if (product) {
          fetchedProducts[item.productId] = product
        }
      }
    }
    setCartProducts(fetchedProducts)
    setLoading(false)
  }

  const handleRemoveItem = (variantId: string) => {
    removeFromCart(variantId)
  }

  useEffect(() => {
    if (cart.length > 0) {
      fetchProducts()
    }
  }, [cart])

  return (
    <div className="mt-4 space-y-4 w-full">
      {cart.map((item) => {
        const product = cartProducts[item.productId]
        const variant = product?.variants.find((v) => v.id === item.variantId)

        return (
          <div
            key={item.variantId}
            className={`my-2 flex items-center justify-between border ${
              isCheckout ? "p-1.5" : "p-2.5"
            } border-neutral-300/55 rounded-lg`}
          >
            <div
              className={`${
                isCheckout
                  ? "flex space-x-2 items-center"
                  : "flex items-center space-x-4 cursor-pointer"
              }`}
            >
              <Image
                src={product?.imageUrl || product?.images[0]?.url}
                alt={product?.title}
                width={80}
                height={80}
                className={`${
                  isCheckout
                    ? "h-16 w-16 object-contain bg-gray-100 rounded-md p-1"
                    : "h-20 w-20 object-contain bg-gray-100 rounded-md p-1"
                }`}
              />
              <div>
                {isCheckout ? (
                  <>
                    <p
                      className="line-clamp-2 font-bold"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      {product?.title}
                    </p>
                    <p className="font-medium text-neutral-500 text-sm">
                      {`GHS ${item?.price * item?.quantity}`}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="line-clamp-2 font-bold">{product?.title}</p>
                    <div className="md:inline-flex space-x-1 hidden">
                      <p className="font-medium text-neutral-400 text-sm">
                        {variant?.weight}
                      </p>
                      <p className="font-medium text-neutral-400 text-sm">
                        {variant?.unit}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            {!isCheckout && (
              <p
                className={`${
                  isCheckout
                    ? "text-xs"
                    : "font-medium hidden md:inline-flex text-neutral-400 text-sm"
                }`}
              >
                {formatCurrency(variant?.price || 0, "GHS")}
              </p>
            )}

            <AddButton
              product={product}
              variantId={item.variantId}
              isCheckout={true}
            />
            <div className="flex items-center gap-x-3">
              {!isCheckout && (
                <p
                  className={`${
                    isCheckout ? "font-medium text-sm" : "font-bold"
                  }`}
                >
                  {formatCurrency(item?.price * item?.quantity, "GHS")}
                </p>
              )}

              <button
                className={`${
                  isCheckout
                    ? "p-1"
                    : "rounded-full w-fit h-fit p-2 hover:bg-gray-100"
                }`}
                onClick={() => handleRemoveItem(item.variantId)}
              >
                <XCircleIcon
                  className={`${
                    isCheckout ? "h-5 w-5" : "h-6 w-6 text-red-500/65"
                  }`}
                />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BasketCartItems
