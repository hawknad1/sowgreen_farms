"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { orderStatusCard } from "@/constants"
import {
  DocumentArrowDownIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline"
import React from "react"
import DisplayOrder from "./DisplayOrder"
import { Order } from "@/types"
import StatusCard from "./StatusCards"
import { ShippingInfo } from "./ShippingInfo"
import { OrderInfo } from "./OrderInfo"
import { formatCurrency } from "@/lib/utils"
import StatusPopup from "./StatusPopup"

const AdminOrderDetailCard = ({ orders }: { orders: Order }) => {
  if (!orders)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    )

  return (
    <div className="">
      <div className="flex flex-col">
        <div className="flex justify-between items-center my-4 z-10">
          <div>
            <h2 className="text-xl font-semibold">
              Order ID : {orders?.orderNumber}
            </h2>
            <p className="text-sm text-gray-500">
              Order details of {orders?.shippingAddress?.name}
            </p>
          </div>

          <div className="flex items-center gap-x-3">
            <Button variant="outline" className="flex gap-x-1">
              <DocumentArrowDownIcon className="w-4 h-4" />
              Send Invoice
            </Button>
            <Button className="bg-lime-600 hover:bg-lime-700 flex gap-x-1">
              <EnvelopeIcon className="w-4 h-4" />
              Contact Buyer
            </Button>
          </div>
        </div>

        <div className="h-screen overflow-scroll scrollbar-hide py-4">
          <div className="border border-neutral-300 rounded-lg p-4 flex flex-col sm:flex-row gap-4">
            <div className="w-full flex flex-col gap-2">
              <p className="font-semibold flex items-center gap-x-1">
                With courier en route
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </p>

              {/* Order status */}
              {/* <StatusCard orderStatus={orderStatusCard} /> */}
              <StatusPopup orderStatus={orderStatusCard} orders={orders} />

              <Separator className="my-4" />

              {/* Shipping and order details */}
              <div className="flex justify-between">
                <ShippingInfo shippingAddress={orders?.shippingAddress} />
                <OrderInfo orders={orders} />
              </div>

              <Separator className="my-4" />

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-bold mb-2">Order Item</h3>
                <DisplayOrder orders={orders} />
              </div>

              <Separator className="my-4" />

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-bold mb-2">Order Summary</h3>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-neutral-400">Subtotal</p>
                    <p className="text-sm text-neutral-400">Delivery Fee</p>
                    <p className="text-sm font-semibold">Total</p>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm text-neutral-400">
                        {formatCurrency(
                          orders?.total - orders?.deliveryFee,
                          "GHS"
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm text-neutral-400">
                        {formatCurrency(orders?.deliveryFee, "GHS")}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm">
                        {formatCurrency(orders?.total, "GHS")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderDetailCard
