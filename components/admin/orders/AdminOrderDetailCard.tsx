"use client"

import React, { useEffect, useState } from "react"
import DisplayOrder from "./DisplayOrder"
import StatusPopup from "./StatusPopup"
import DeleteOrderDialog from "./dialogs/DeleteOrderDialog"
import ModifyOrderDialog from "./dialogs/ModifyOrderDialog"
import CancelOrderDialog from "./dialogs/CancelOrderDialog"
import AdminMiddleCards from "./AdminMiddleCards"

import { Order, User } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { orderStatusCard } from "@/constants"
import { useSession } from "next-auth/react"
import { deductBalance } from "@/lib/actions/deductBalance"

const AdminOrderDetailCard = ({ orders }: { orders: Order }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [activeUser, setActiveUser] = useState<User>(null)
  const { data: session } = useSession()
  const user = session?.user

  // const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const deliveryFee = orders?.deliveryFee

  // const orderTotal = orders?.total + orders?.deliveryFee
  const orderTotal = orders?.total + deliveryFee

  const balance = activeUser?.user?.balance

  // deductBalance()
  const { remainingAmount, updatedBalance, updatedOrderTotal } = deductBalance(
    balance,
    orderTotal
  )

  const email = orders?.shippingAddress?.email

  // Fetch user details if email is provided
  useEffect(() => {
    const getUser = async () => {
      if (!user?.email) return
      setIsLoading(true)
      try {
        const res = await fetch(`/api/user/${email}`, {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const active = await res.json()
          setActiveUser(active)
          // setUser(active)
        } else {
          console.error("Failed to fetch user details:", res.statusText)
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error)
      } finally {
        setIsLoading(false)
      }
    }
    getUser()
  }, [email])

  if (!orders)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    )

  // const firstName = orders?.dispatchRider?.firstName
  // const lastName = orders?.dispatchRider?.lastName
  // const rider =
  //   firstName && lastName ? `${firstName} ${lastName}` : "Not Assigned"

  const rider = orders?.dispatchRider?.fullName || "Not Assigned"

  return (
    <div className="p-4 w-full">
      <div className="flex flex-col">
        <div className="flex justify-between sticky top-0 z-10  h-16 items-center gap-2 bg-white px-4">
          <div>
            <h2 className="lg:text-xl text-xs md:text-base font-semibold">
              Order No. : {orders?.orderNumber}
            </h2>
            <p className="md:text-sm text-xs text-gray-500">
              Order details of {orders?.shippingAddress?.name}
            </p>
          </div>

          <div className="flex items-center gap-x-3">
            <CancelOrderDialog order={orders} className="" />

            {/* <AddCredit /> */}
            <DeleteOrderDialog
              order={orders}
              className="hidden lg:inline-flex"
            />
          </div>
        </div>

        <div className="h-screen overflow-scroll scrollbar-none py-4">
          <div className="border border-neutral-300 rounded-lg p-4 flex flex-col sm:flex-row gap-4">
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="font-semibold text-xs md:text-sm lg:text-base flex items-center gap-x-1">
                  With courier en route
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </p>
                <p className="font-semibold text-neutral-600 text-xs md:text-sm lg:text-base">
                  Dispatch Rider: <span className="text-black">{rider}</span>
                </p>
              </div>

              {/* Order status */}
              {/* <StatusCard orderStatus={orderStatusCard} /> */}
              <StatusPopup orderStatus={orderStatusCard} orders={orders} />

              <Separator className="my-4" />

              {/* Shipping and order details */}
              <AdminMiddleCards orders={orders} balance={balance} />

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
                    <p className="text-sm font-semibold">Subtotal</p>
                    <p className="text-sm font-semibold">Delivery Fee</p>
                    <p
                      className={`font-semibold text-sm  ${
                        orders?.creditAppliedTotal >= 0
                          ? "text-emerald-500"
                          : "text-red-500 "
                      }`}
                    >
                      Credit Bal.
                    </p>
                    <p className="text-sm font-semibold">Total</p>

                    <p className="text-sm font-semibold text-red-500">
                      Total Due
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm">
                        {formatCurrency(orders?.total, "GHS")}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm ">
                        {formatCurrency(orders?.deliveryFee, "GHS")}
                      </p>
                    </div>
                    <div className={`flex justify-between `}>
                      <p
                        className={`font-semibold text-sm  ${
                          orders?.creditAppliedTotal >= 0
                            ? "text-emerald-500"
                            : "text-red-500 "
                        }`}
                      >
                        {formatCurrency(orders?.creditAppliedTotal, "GHS")}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm">
                        {formatCurrency(orderTotal, "GHS")}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="font-semibold text-sm text-red-500">
                        {formatCurrency(orders?.updatedOrderTotal, "GHS")}
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
