"use client"
import Image from "next/image"
import OrderConfirmSkeleton from "@/components/skeletons/OrderConfirmSkeleton"
import { Separator } from "@/components/ui/separator"
import { useCartStore, useDeliveryStore, useOrderDataStore } from "@/store"
import { useEffect, useMemo, useState } from "react"
import { OrderInfo } from "./OrderInfo"
import { ShippingAddress } from "./ShippingAddress"
import { addTax } from "@/lib/addTax"
import { formatCurrency } from "@/lib/utils"

const ThankYouPage = () => {
  const [calculatedTotal, setCalculatedTotal] = useState(0)

  const ordersData = useOrderDataStore((state) => state.ordersData)
  const cart = useCartStore((state) => state.cart)

  const { orderNumber, shippingAddress, products, total } = ordersData || {}
  const { deliveryFee } = useDeliveryStore()

  // Calculate cart total with tax
  const cartWithTax = cart.map((product) => ({
    ...product,
    price: addTax(product.price),
  }))

  useEffect(() => {
    let tempTotal = 0
    products?.forEach((order) => {
      tempTotal += parseFloat(order.total)
    })
    setCalculatedTotal(tempTotal)
  }, [products])

  const formattedDelivery = formatCurrency(deliveryFee, "GHS")

  const deliveryMethod = ordersData?.deliveryMethod || ""
  const deliveryMethodLabel = useMemo(() => {
    switch (deliveryMethod) {
      case "same-day-delivery":
        return "Same Day Delivery"
      case "next-day-delivery":
        return "Next Day Delivery"
      default:
        return "Pick up"
    }
  }, [deliveryMethod])

  if (!ordersData) {
    return <OrderConfirmSkeleton />
  }

  return (
    <div className="flex flex-col items-center w-full p-8 bg-gray-100 min-h-screen">
      <div className="flex flex-col items-center gap-y-2 mb-3">
        <p className="font-semibold text-sm text-neutral-500/95">THANK YOU</p>
        <h3 className="text-2xl font-bold">Your order is confirmed</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        <div className="w-full bg-white rounded-l-lg p-4">
          <OrderInfo orderNumber={orderNumber} />
          <Separator className="mt-6 mb-4" />
          <ShippingAddress shippingAddress={shippingAddress} />
          <Separator className="mt-6 mb-4" />
          <div className="flex flex-col">
            <h2 className="text-sm font-bold mb-3">Shipping Method</h2>
            <p className="text-sm font-medium text-neutral-500/80 mb-2">
              {deliveryMethodLabel}
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col justify-between bg-white rounded-r-lg p-4">
          <div className="flex flex-col gap-2 flex-grow">
            <h2 className="text-sm font-bold mb-2">Ordered Items</h2>
            <div className="flex flex-col gap-3 max-h-[290px] overflow-y-auto scrollbar-hide p-2">
              {products?.length ? (
                products.map((order) => (
                  <div
                    key={order?.item?.id}
                    className="flex items-start justify-between"
                  >
                    <div className="flex gap-4">
                      <div className="bg-gray-100 p-1.5 rounded-lg">
                        <Image
                          src={order?.item?.imageUrl}
                          alt={order?.item?.title}
                          height={50}
                          width={50}
                          className="h-14 w-14 object-contain"
                          priority
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {order?.item?.title}
                        </p>
                        <p className="text-sm text-neutral-500/85">
                          x {order?.quantity}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {formatCurrency(order?.item.price, "GHS")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500">
                  No products available.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-y-2 mt-3">
            <Separator />
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-neutral-500/85">
                  Subtotal
                </p>
                <p className="text-sm font-semibold text-neutral-500/85">
                  {formatCurrency(calculatedTotal, "GHS")}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-medium text-neutral-500/85">
                  Delivery Fee
                </p>
                <p className="text-sm font-semibold text-neutral-500/85">
                  {formattedDelivery}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-bold text-black">Total</p>
                <p className="text-sm font-bold">
                  {formatCurrency(total, "GHS")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThankYouPage
