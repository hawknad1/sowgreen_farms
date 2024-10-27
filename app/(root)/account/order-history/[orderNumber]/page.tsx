"use client"

import { Separator } from "@/components/ui/separator"
import { Order } from "@/types"
import Image from "next/image"
import { useEffect, useState } from "react"

const OrderDetailPage = ({ params }: { params: { orderNumber: string } }) => {
  const [orderDetails, setOrderDetails] = useState<Order | null>(null)

  const { orderNumber } = params

  useEffect(() => {
    if (!orderNumber) return

    async function fetchOrderDetails() {
      try {
        const res = await fetch(`/api/order-history/${orderNumber}`)
        if (res.ok) {
          const data = await res.json()
          setOrderDetails(data)
        } else {
          console.error("Failed to fetch order details:", res.statusText)
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
      }
    }

    fetchOrderDetails()
  }, [orderNumber])

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8">
      <div className="w-full max-w-5xl px-4 space-y-6">
        <div className="grid grid-cols-5 gap-4 text-center font-bold text-gray-700 text-lg border-t border-b border-black p-4">
          <h2>Order #</h2>
          <h2>Date Placed</h2>
          <h2>Shipping Method</h2>
          <h2>Order Total</h2>
          <h2>Status</h2>
        </div>

        {orderDetails && (
          <div className="grid grid-cols-5 gap-4 text-center text-gray-600 p-4 mb-4 border-b border-gray-200">
            <p>{orderDetails.orderNumber}</p>
            <p>{new Date(orderDetails.createdAt).toLocaleDateString()}</p>
            <p>{orderDetails.deliveryMethod}</p>
            <p>{`GHS ${orderDetails.total.toFixed(2)}`}</p>
            <p>{orderDetails.status}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-4">
          <div className="border border-neutral-300 rounded-lg p-6 bg-white h-auto">
            <h2 className="font-bold text-gray-700 mb-3 text-lg">
              Delivery Address
            </h2>
            <p>{orderDetails?.shippingAddress.name}</p>
            <p>{`${orderDetails?.shippingAddress.address}, ${orderDetails?.shippingAddress.city}`}</p>
            <p>{orderDetails?.shippingAddress.phone}</p>
            <p>{orderDetails?.shippingAddress.email}</p>
          </div>

          <div className="border border-neutral-300 rounded-lg p-6 bg-white h-auto">
            <h2 className="font-bold text-gray-700 mb-3 text-lg">
              Order Details
            </h2>
            <div className="flex justify-between">
              <p className="font-medium">Order Number</p>
              <p>{orderDetails?.orderNumber}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Delivery Fee</p>
              <p>{orderDetails?.deliveryFee}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Products Ordered</p>
              <p>{`${orderDetails?.products.length} Items`}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Order Total</p>
              <p>{orderDetails?.total}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-8">
          <div className="flex justify-between items-center border-b border-black pb-2">
            <h2 className="font-bold text-lg">Products</h2>
            <p className="text-neutral-600">{`Showing All ${orderDetails?.products.length} Products`}</p>
          </div>

          <div className="space-y-4 overflow-auto max-h-96">
            {orderDetails?.products.map((product, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 border-b border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={product.product.imageUrl}
                    alt={product.product.title}
                    className="h-24 w-24 object-contain rounded-md"
                    width={90}
                    height={90}
                  />
                  <div className="flex flex-col space-y-1 max-w-xs">
                    <p className="font-medium text-gray-800">
                      {product.product.title}
                    </p>
                    <p className="text-gray-500 text-sm line-clamp-1">
                      {product.product.description}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="font-medium text-gray-800">{`GHS ${product.product.price.toFixed(
                    2
                  )}`}</p>
                  <div className="text-sm text-neutral-600 space-x-2">
                    <span className="font-semibold">{`QTY : ${product.quantity}`}</span>
                    <span>{`Subtotal: GHS ${product?.quantityTotal}`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="flex justify-between">
              <p className="text-neutral-600">Subtotal</p>
              <p>{`GHS ${orderDetails?.total - orderDetails?.deliveryFee}`}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-neutral-600">Delivery Fee</p>
              <p>{`GHS ${orderDetails?.deliveryFee}`}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-neutral-600">Total</p>
              <p>{`GHS ${orderDetails?.total}`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage
