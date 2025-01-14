import { formatCurrency } from "@/lib/utils"
import { Order, ProductOrder } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"

const DisplayOrder = ({ orders }: { orders: Order }) => {
  const products = orders?.products
  const router = useRouter()

  if (!products?.length) {
    return <p>No products available in this order.</p>
  }

  return (
    <div>
      {products?.map((ord: ProductOrder) => {
        console.log(ord, "ord---")
        return (
          <div
            key={ord.productId}
            className={`flex items-center w-full mb-4 ${
              ord.available === false ? "opacity-50" : ""
            }`}
          >
            <div
              className="bg-gray-50 rounded-md p-2 cursor-pointer"
              onClick={() => router.push(`/products/${ord.product.id}`)}
            >
              <Image
                src={ord.product.imageUrl || ord?.product?.images[0]?.url}
                alt={ord.product.title}
                width={80}
                height={80}
                className={`h-16 w-16 object-contain rounded-md ${
                  ord.available === false ? "grayscale" : ""
                }`}
              />
            </div>
            <div className="flex justify-between items-center w-full ml-4">
              <div
                className="flex flex-col flex-grow cursor-pointer"
                onClick={() => router.push(`/products/${ord.product.id}`)}
              >
                <p
                  className={`text-sm font-semibold line-clamp-2 ${
                    ord.available === false ? "text-gray-500" : ""
                  }`}
                >
                  {ord.product?.title}
                </p>

                <p className="font-medium text-gray-600/65 text-sm">
                  {formatCurrency(ord.price, "GHS")}
                  {ord?.weight === null ? (
                    ""
                  ) : (
                    <span className="text-sm text-neutral-400">
                      {` / ${ord?.weight}${ord?.unit}`}
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm text-neutral-600 space-x-2 flex flex-col">
                  <span className="font-semibold">{`QTY : ${ord.quantity}`}</span>
                  <span>{`Subtotal:  ${formatCurrency(
                    parseFloat(ord?.quantityTotal),
                    "GHS"
                  )}`}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DisplayOrder
