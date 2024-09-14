"use client"
import { Separator } from "@/components/ui/separator"
import { useOrdersStore } from "@/store"
import Image from "next/image"
import { useMemo } from "react"
import { OrderInfo } from "./OrderInfo"
import { ShippingAddress } from "./ShippingAddress"

const ThankYouPage = () => {
  const ordersData = useOrdersStore((state) => state.ordersData)

  // Move the hook calls outside the condition
  const deliveryFee = 20
  const total = ordersData?.total || 0 // Use fallback values in case ordersData is undefined
  const deliveryMethod = ordersData?.deliveryMethod || ""

  const allTotal = useMemo(() => total + deliveryFee, [total])

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
    return <div>No order data available</div>
  }

  const { orderNumber, shippingAddress, products } = ordersData

  return (
    <div className="flex flex-col items-center w-full p-8 bg-gray-100 h-screen">
      <div className="flex flex-col items-center gap-2.5 mb-8">
        <p className="font-semibold text-sm text-neutral-500/95">THANK YOU</p>
        <h3 className="text-2xl font-bold">Your order is confirmed</h3>
      </div>
      <div className="max-w-3xl flex flex-col sm:flex-row gap-x-2 items-start justify-between w-full max-h-[290px]">
        <div className="flex gap-x-2 items-start justify-between w-full h-full">
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
                        <p className="text-sm font-semibold">{order?.total}</p>
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
                    {total.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-neutral-500/85">
                    Delivery Fee
                  </p>
                  <p className="text-sm font-semibold text-neutral-500/85">
                    {deliveryFee.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-black">Total</p>
                  <p className="text-sm font-semibold">{allTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThankYouPage
