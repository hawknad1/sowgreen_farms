"use client"

import React from "react"
import DisplayOrder from "./DisplayOrder"
import StatusPopup from "./StatusPopup"
import AddCredit from "./AddCredit"
import DeleteOrderDialog from "./dialogs/DeleteOrderDialog"
import ModifyOrderDialog from "./dialogs/ModifyOrderDialog"
import CancelOrderDialog from "./dialogs/CancelOrderDialog"

import { Order } from "@/types"
import { ShippingInfo } from "./ShippingInfo"
import { OrderInfo } from "./OrderInfo"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { orderStatusCard } from "@/constants"

const AdminOrderDetailCard = ({ orders }: { orders: Order }) => {
  if (!orders)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    )

  // const rider =
  //   orders?.dispatchRider?.charAt(0).toUpperCase() +
  //   orders?.dispatchRider?.slice(1)

  const firstName = orders?.dispatchRider?.firstName
  const lastName = orders?.dispatchRider?.lastName
  const rider =
    firstName && lastName ? `${firstName} ${lastName}` : "Not Assigned"

  console.log(orders, "orders---ORDERS")
  console.log(rider, "RIDER---RIDER")

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <div className="flex justify-between sticky top-0 z-10  h-16 items-center gap-2 bg-white px-4">
          <div>
            <h2 className="lg:text-xl text-sm md:text-base font-semibold">
              Order No. : {orders?.orderNumber}
            </h2>
            <p className="md:text-sm text-xs text-gray-500">
              Order details of {orders?.shippingAddress?.name}
            </p>
          </div>

          <div className="flex items-center gap-x-3">
            <CancelOrderDialog order={orders} className="" />

            <AddCredit />
            <DeleteOrderDialog
              order={orders}
              className="hidden lg:inline-flex"
            />
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
                  Dispatch Rider: <span className="text-black">{rider}</span>
                </p>
              </div>

              {/* Order status */}
              {/* <StatusCard orderStatus={orderStatusCard} /> */}
              <StatusPopup orderStatus={orderStatusCard} orders={orders} />

              <Separator className="my-4" />

              {/* Shipping and order details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ShippingInfo order={orders} />
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
                        {formatCurrency(orders?.total, "GHS")}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm text-neutral-400">
                        {formatCurrency(orders?.deliveryFee, "GHS")}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm">
                        {formatCurrency(
                          orders?.total + orders?.deliveryFee,
                          "GHS"
                        )}
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
