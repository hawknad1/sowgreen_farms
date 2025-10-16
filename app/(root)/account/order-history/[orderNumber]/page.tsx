"use client"
import Image from "next/image"
import ChangeDeliveryMethodDialog from "./DeliveryMethodDialog"
import CancelCustomerOrderDialog from "./CancelCustomerOrderDialog"
import EditCustomerOrderDialog from "./EditCustomerOrderDialog"
import PaystackPayNow from "./PaystackPayNow"

import { Order, User, UserProps } from "@/types"
import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { capitalizeName } from "@/lib/capitalizeName"
import { deductBalance } from "@/lib/actions/deductBalance"
import { useSession } from "next-auth/react"
import { getUser } from "@/lib/actions/getUser"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { SquarePen } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import EditNotesDialog from "./EditNotesDialog"

const OrderDetailPage = ({ params }: { params: { orderNumber: string } }) => {
  const [orderDetails, setOrderDetails] = useState<Order | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const user = session?.user as UserProps
  const { orderNumber } = params

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.email) return

      setIsLoading(true)
      const data = await getUser(user.email)
      if (data) setUserData(data)
      setIsLoading(false)
    }

    fetchUser()
  }, [user?.email])

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const res = await fetch(`/api/order-history/${orderNumber}`, {
          method: "GET",
          cache: "no-store",
        })
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

  const orderTotal = orderDetails?.total + orderDetails?.deliveryFee
  const balance = userData?.user?.balance
  const { updatedBalance, updatedOrderTotal } = deductBalance(
    balance,
    orderTotal
  )

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="space-y-4 w-full max-w-5xl px-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  const deliveryMethodNew = orderDetails?.shippingAddress?.deliveryMethod

  function formatDeliveryMethod(method: string) {
    const trimmed = method?.trim()
    if (trimmed?.toLowerCase().startsWith("home delivery")) {
      return trimmed
    }
    const cleaned = trimmed?.replace(/^pickup-?/i, "").trim()
    return `PICK UP @ ${cleaned}`
  }

  const status = orderDetails?.status
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")

  const name = capitalizeName(orderDetails?.shippingAddress.name)

  const disablePayNow =
    orderDetails?.status === "confirmed" && updatedOrderTotal === 0

  const getStatusBadgeVariant = () => {
    switch (orderDetails?.status.toLowerCase()) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "delivered":
        return "success"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Order Summary Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order #{orderDetails?.orderNumber}
            </h1>
            <p className="text-gray-500 text-sm">
              Placed on{" "}
              {new Date(orderDetails?.createdAt).toLocaleDateString("en-GH", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge variant={getStatusBadgeVariant()} className="mt-1">
                {status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Delivery Method
              </p>
              <p className="text-sm text-gray-900 mt-1">
                {formatDeliveryMethod(deliveryMethodNew)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Order Total</p>
              <p className="text-sm text-gray-900 mt-1">
                {formatCurrency(orderTotal, "GHS")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment</p>
              <p className="text-sm text-gray-900 mt-1 capitalize">
                {orderDetails?.paymentAction === "paid" ? (
                  <span className="text-emerald-600">
                    Paid ({orderDetails?.paymentMode})
                  </span>
                ) : (
                  <span className="text-amber-600">Pending</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Delivery Address Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="text-sm text-gray-600">
                  {orderDetails?.shippingAddress.address},<br />
                  {orderDetails?.shippingAddress.city} -{" "}
                  {orderDetails?.shippingAddress.region}
                </p>
                <p className="text-sm text-gray-600">
                  {orderDetails?.shippingAddress.phone}
                </p>
                <p className="text-sm text-gray-600">
                  {orderDetails?.shippingAddress.email}
                </p>
              </div>
              {/* <TooltipProvider>
                <div className="flex w-full justify-between mt-1.5 items-center">
                  <h3 className="font-medium">
                    NOTE: <br />
                    <span className="text-sm">
                      {orderDetails?.specialNotes}
                    </span>
                  </h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button>
                        <SquarePen className="w-4 h-4" />
                      </button>{" "}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit notes</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider> */}

              {orderDetails?.specialNotes && (
                <EditNotesDialog order={orderDetails} />
              )}
            </CardContent>
          </Card>

          {/* Order Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(orderDetails?.total, "GHS")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Delivery Fee</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(orderDetails?.deliveryFee, "GHS")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`text-sm font-medium ${
                      orderDetails?.creditAppliedTotal >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {orderDetails?.creditAppliedTotal >= 0
                      ? "Credit Balance"
                      : "Balance Due"}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      orderDetails?.creditAppliedTotal >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(
                      Math.abs(orderDetails?.creditAppliedTotal),
                      "GHS"
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    Total
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(orderTotal, "GHS")}
                  </span>
                </div>
                <div className="flex justify-between rounded-md">
                  <span className="text-sm font-semibold text-red-600">
                    Total Due
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatCurrency(orderDetails?.updatedOrderTotal, "GHS")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm px-4 py-4 sm:px-6 sm:py-4">
          {" "}
          {/* Increased vertical padding */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {" "}
            {/* Changed items-start to items-center */}
            <h2 className="text-lg font-semibold text-gray-900">
              Order Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto">
              <PaystackPayNow
                order={orderDetails}
                updatedBalance={updatedBalance}
                disablePayNow={disablePayNow}
              />
              <EditCustomerOrderDialog order={orderDetails} />
              <CancelCustomerOrderDialog order={orderDetails} />
              <ChangeDeliveryMethodDialog order={orderDetails} customer />
            </div>
          </div>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto pr-2 -mr-2 custom-scrollbar">
              <div className="space-y-4">
                {orderDetails?.products?.map((product, index) => (
                  <div
                    key={index}
                    className={`flex flex-col sm:flex-row justify-between p-4 border border-gray-200 rounded-lg ${
                      product?.available === false && "opacity-70 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <Image
                          src={
                            product?.product?.images[0]?.url ||
                            product?.product?.imageUrl
                          }
                          alt={product.product.title}
                          className={`object-contain rounded-md bg-gray-100 p-1 ${
                            product?.available === false && "grayscale"
                          }`}
                          fill
                        />
                      </div>
                      <div>
                        <h3
                          className={`text-sm font-medium ${
                            product?.available === false
                              ? "text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {product?.product?.title}
                          {product?.available === false && " - Not Available"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatCurrency(product?.price, "GHS")}
                          {product?.weight && (
                            <span className="text-xs text-gray-400 ml-1">
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
                    {/* Modified quantity section for mobile */}
                    <div className="mt-4 sm:mt-0">
                      <div className="flex justify-between sm:block">
                        <p className="text-sm text-gray-900 sm:mb-1">
                          Qty: {product?.quantity}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(
                            parseFloat(product?.quantityTotal),
                            "GHS"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total Summary */}
            <div className="mt-6 border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium">
                  {formatCurrency(orderDetails?.total, "GHS")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Delivery Fee</span>
                <span className="text-sm font-medium">
                  {formatCurrency(orderDetails?.deliveryFee, "GHS")}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={`text-sm font-medium ${
                    orderDetails?.creditAppliedTotal >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {orderDetails?.creditAppliedTotal >= 0
                    ? "Credit Balance"
                    : "Balance Due"}
                </span>
                <span
                  className={`text-sm font-medium ${
                    orderDetails?.creditAppliedTotal >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(
                    Math.abs(orderDetails?.creditAppliedTotal),
                    "GHS"
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {formatCurrency(orderTotal, "GHS")}
                </span>
              </div>
              <div className="flex justify-between rounded-md">
                <span className="text-base font-semibold text-red-600">
                  Total Due
                </span>
                <span className="text-base font-semibold text-red-600">
                  {formatCurrency(orderDetails?.updatedOrderTotal, "GHS")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OrderDetailPage
