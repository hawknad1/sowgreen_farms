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
import { ShippingInfo } from "./ShippingInfo"
import { OrderInfo } from "./OrderInfo"
import { formatCurrency } from "@/lib/utils"
import StatusPopup from "./StatusPopup"
import { DollarSign } from "lucide-react"
import AddCredit from "./AddCredit"
import DeleteOrderDialog from "./DeleteOrderDialog"
import { PencilSquareIcon } from "@heroicons/react/20/solid"
import ModifyOrderDialog from "./ModifyOrderDialog"

const AdminOrderDetailCard = ({ orders }: { orders: Order }) => {
  if (!orders)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    )

  const rider =
    orders?.dispatchRider?.charAt(0).toUpperCase() +
    orders?.dispatchRider?.slice(1)

  return (
    <div className="">
      <div className="flex flex-col">
        <div className="flex justify-between items-center my-4 z-10">
          <div>
            <h2 className="text-xl font-semibold">
              Order No. : {orders?.orderNumber}
            </h2>
            <p className="text-sm text-gray-500">
              Order details of {orders?.shippingAddress?.name}
            </p>
          </div>

          <div className="flex items-center gap-x-3">
            {/* <Button variant="outline" className="flex gap-x-1">
              <DocumentArrowDownIcon className="w-4 h-4" />
              Send Invoice
            </Button> */}
            {/* <Button variant="destructive" className="font-medium">
              Delete Order
            </Button> */}

            <DeleteOrderDialog order={orders} />
            <AddCredit />
          </div>
        </div>

        <div className="h-screen overflow-scroll scrollbar-hide py-4">
          <div className="border border-neutral-300 rounded-lg p-4 flex flex-col sm:flex-row gap-4">
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="font-semibold flex items-center gap-x-1">
                  With courier en route
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </p>
                <p className="font-semibold text-neutral-600">
                  Dispatch Rider:{" "}
                  <span className="text-black">{rider || "Not assigned"}</span>
                </p>
              </div>

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
                <div className="flex justify-between">
                  <h3 className="text-lg font-bold mb-2">Order Item</h3>
                  <ModifyOrderDialog order={orders} />
                </div>
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
