"use client"
import { Order } from "@/types"
import Image from "next/image"
import { useEffect, useState } from "react"
import EditCustomerOrderDialog from "./EditCustomerOrderDialog"
import CancelCustomerOrderDialog from "./CancelCustomerOrderDialog"
import { formatCurrency } from "@/lib/utils"
import ChangeDeliveryMethodDialog from "./DeliveryMethodDialog"
import { capitalizeName } from "@/lib/capitalizeName"

const OrderDetailPage = ({ params }: { params: { orderNumber: string } }) => {
  const [orderDetails, setOrderDetails] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { orderNumber } = params

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const res = await fetch(`/api/order-history/${orderNumber}`)
        if (!res.ok) throw new Error(res.statusText)
        const data = await res.json()
        setOrderDetails(data)
      } catch (error) {
        console.error("Error fetching order details:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrderDetails()
  }, [orderNumber])

  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    )

  const subtotal = orderDetails?.total - orderDetails?.deliveryFee

  const status = orderDetails?.status
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")

  const name = capitalizeName(orderDetails?.shippingAddress.name)

  return (
    <div className="min-h-screen flex flex-col items-center bg-white py-8">
      <div className="w-full max-w-5xl px-4 space-y-6">
        <div className="grid grid-cols-5 gap-4 p-4 text-center place-items-center font-bold text-gray-700 text-lg border-t border-b border-black ">
          <h2 className="text-sm lg:text-base">Order #</h2>
          <h2 className="text-sm lg:text-base">Date Placed</h2>
          <h2 className="text-sm lg:text-base">Shipping Method</h2>
          <h2 className="text-sm lg:text-base">Order Total</h2>
          <h2 className="text-sm lg:text-base">Status</h2>
        </div>

        {orderDetails && (
          <div className="grid grid-cols-5 gap-4 text-center place-items-center text-gray-600 p-4 mb-4 border-b border-gray-200">
            <p className="text-sm lg:text-base">{orderDetails.orderNumber}</p>
            <p className="text-sm lg:text-base">
              {new Date(orderDetails.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm lg:text-base">
              {orderDetails.shippingAddress.deliveryMethod}
            </p>
            <p className="text-sm lg:text-base">{`GHS ${(
              orderDetails.total + orderDetails.deliveryFee
            ).toFixed(2)}`}</p>
            <p>{status}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-4">
          <div className="border border-neutral-300 rounded-lg p-6 bg-white h-auto">
            <h2 className="font-bold text-gray-700 mb-3 text-base lg:text-lg">
              Delivery Address
            </h2>
            <div className="flex flex-col gap-1 justify-center">
              <p className="text-sm lg:text-base text-neutral-600">{name}</p>
              <p className="text-sm lg:text-base text-neutral-600 max-w-sm">{`${orderDetails?.shippingAddress.address}, ${orderDetails?.shippingAddress.city} - ${orderDetails?.shippingAddress.region}`}</p>

              <p className="text-sm lg:text-base text-neutral-600">
                {orderDetails?.shippingAddress.email}
              </p>
              <p className="text-sm lg:text-base text-neutral-600">
                {orderDetails?.shippingAddress.phone}
              </p>
            </div>
          </div>

          <div className="border border-neutral-300 rounded-lg p-6 bg-white h-auto">
            <h2 className="font-bold text-gray-700 mb-3 text-base lg:text-lg">
              Order Details
            </h2>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <p className="font-medium text-sm lg:text-base">
                  Item(s) Ordered
                </p>
                <p className="text-sm text-neutral-600 lg:text-base">{`${orderDetails?.products.length} Items`}</p>
              </div>

              <div className="flex justify-between">
                <p className="font-medium text-sm lg:text-base">Delivery Fee</p>
                <p className="text-sm text-neutral-600 lg:text-base">{`GHS ${orderDetails?.deliveryFee.toFixed(
                  2
                )}`}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium text-sm lg:text-base">Subtotal</p>
                <p className="text-sm text-neutral-600 lg:text-base">{`GHS ${orderDetails?.total.toFixed(
                  2
                )}`}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium text-sm lg:text-base">Order Total</p>
                <p className="text-sm text-neutral-600 lg:text-base">{`GHS ${(
                  orderDetails?.total + orderDetails?.deliveryFee
                ).toFixed(2)}`}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-8 w-full">
          <div className="flex items-center w-full justify-center md:justify-between">
            <h2 className="font-bold text-lg hidden md:inline-flex ">
              Products
            </h2>
            <div className="flex w-full gap-x-4 md:max-w-xl">
              <EditCustomerOrderDialog order={orderDetails} />
              <ChangeDeliveryMethodDialog order={orderDetails} />
              <CancelCustomerOrderDialog order={orderDetails} />
            </div>

            {/* <p className="text-neutral-600">{`Showing All ${orderDetails?.products.length} Products`}</p> */}
          </div>

          <div className="space-y-4 overflow-auto max-h-96 border border-slate-300 rounded-lg">
            {orderDetails?.products.map((product, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 border-b border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={
                        product.product.images[0]?.url ||
                        product?.product.imageUrl
                      }
                      alt={product.product.title}
                      className="h-20 w-20 object-contain rounded-md bg-slate-100/85 p-0.5"
                      width={90}
                      height={90}
                    />
                    <div className="flex flex-col space-y-1 max-w-xs">
                      <p className="font-semibold text-gray-800 text-base">
                        {product.product.title}
                      </p>
                      <p className="font-medium text-gray-600/65 text-sm">
                        {formatCurrency(product.price, "GHS")}
                        {product?.weight === null ? (
                          ""
                        ) : (
                          <span className="text-sm text-neutral-400">
                            {` / ${
                              product?.weight < 1
                                ? product?.weight * 1000
                                : product?.weight
                            }${product?.unit}`}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-sm text-neutral-600 space-x-2 flex flex-col">
                      <span className="font-semibold">{`QTY : ${product.quantity}`}</span>
                      <span>{`Subtotal:  ${formatCurrency(
                        parseFloat(product?.quantityTotal),
                        "GHS"
                      )}`}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex flex-col gap-y-0.5 border border-slate-300 rounded-lg p-2">
            <div className="flex justify-between">
              <p className="text-neutral-500 text-sm lg:text-base">
                Delivery Fee
              </p>
              <p className="font-medium text-sm lg:text-base">{`GHS ${orderDetails?.deliveryFee.toFixed(
                2
              )}`}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-neutral-500 text-sm lg:text-base">Subtotal</p>
              <p className="font-medium text-sm lg:text-base">{`GHS ${orderDetails?.total.toFixed(
                2
              )}`}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-neutral-500 text-sm lg:text-base">Total</p>
              <p className="font-medium text-sm lg:text-base">{`GHS ${(
                orderDetails?.total + orderDetails?.deliveryFee
              ).toFixed(2)}`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage
