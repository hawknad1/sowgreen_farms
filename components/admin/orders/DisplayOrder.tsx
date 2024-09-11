import { Order, ProductOrder } from "@/types"
import Image from "next/image"
import React from "react"

const DisplayOrder = ({ orders }: { orders: Order }) => {
  const products = orders?.products

  if (!products?.length) {
    return <p>No products available in this order.</p>
  }

  return (
    <div>
      {products?.map((ord: ProductOrder) => (
        <div key={ord.productId} className="flex items-center w-full mb-4">
          <div className="bg-gray-50 rounded-md p-2">
            <Image
              src={ord.product.imageUrl}
              alt={ord.product.title}
              width={80}
              height={80}
              className="h-16 w-16 object-contain rounded-md"
            />
          </div>
          <div className="flex justify-between items-center w-full ml-4">
            <div className="flex flex-col flex-grow">
              <p className="text-sm font-semibold line-clamp-2">
                {ord.product?.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Quantity: {ord?.quantity}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-sm font-bold mt-1">GHC {ord.quantityTotal}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DisplayOrder
