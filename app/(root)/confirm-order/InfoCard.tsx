"use client"
import { Separator } from "@/components/ui/separator"
import React, { useMemo } from "react"
import Card from "./Card"
import { date, formatCurrency } from "@/lib/utils"
import { useDeliveryStore, useUserStore } from "@/store"
import { FaMapMarkerAlt, FaTruck, FaClipboardList } from "react-icons/fa"
import { deductBalance } from "@/lib/actions/deductBalance"

interface InfoCardProps {
  data: any
}

const InfoCard = ({ data }: InfoCardProps) => {
  const deliveryMethod = data?.formData?.deliveryMethod?.trim()?.toUpperCase()
  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const { user } = useUserStore()

  // console.log(user, "USER")

  let total = data?.total + deliveryFee

  const {
    updatedBalance,
    updatedOrderTotal,
    remainingAmount,
    proceedToPaystack,
  } = deductBalance(user?.user?.balance, total)

  const deliveryMethodLabel = useMemo(() => {
    switch (deliveryMethod) {
      case "DZORWULU":
        return "PICK UP - DZORWULU"
      case "WEB DuBOIS CENTER":
        return `PICK UP - WEB DuBOIS CENTER`
      case `Home Delivery - ${deliveryMethod}`:
        return `Home Delivery - ${deliveryMethod}`
      default:
        return deliveryMethod || "Not specified"
    }
  }, [deliveryMethod])

  const deliveryMethodDisplay = useMemo(() => {
    const normalizedDeliveryMethod = deliveryMethod.trim().toLowerCase()

    // Check if the delivery method includes "home delivery"
    if (normalizedDeliveryMethod.includes("home delivery")) {
      return deliveryMethod // Return the original delivery method
    }

    // Otherwise, prepend "PICK UP @" to the delivery method
    return (
      <div className="flex items-center gap-x-2">
        <p className="text-xs md:text-sm">PICK UP @</p>
        <p className="font-semibold text-xs md:text-sm lg:text-base">{`${deliveryMethod} - ${data?.deliveryDate}`}</p>
      </div>
    )
  }, [deliveryMethod])

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="h-fit md:h-full">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="lg:text-xl text-sm font-bold text-gray-800 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              Delivery Address
            </h3>
            <div className="mt-2 space-y-1 text-gray-600 text-xs md:text-base">
              <p>{data?.formData?.name || "No name"}</p>
              <p>
                {data?.formData?.address || "No address"},{" "}
                {data?.formData?.city || "No city"}
              </p>
              <p>{data?.formData?.region || "No region"}</p>
              <p>{data?.formData?.phone || "No phone"}</p>
              <p>{data?.formData?.email || "No email"}</p>
            </div>
          </div>
          <Separator className="" />
          <div>
            <h3 className="lg:text-xl text-sm font-bold text-gray-800 flex items-center gap-2">
              <FaTruck className="text-green-500" />
              Delivery Method
            </h3>
            {/* <p className="mt-2 text-gray-600">
              <span className="bg-cyan-500/25 text-cyan-500 px-2 py-1 rounded-full text-sm">
                {deliveryMethodNew}
              </span>
            </p> */}
            <p className="py-1 text-xs md:text-sm lg:text-base">
              {deliveryMethodDisplay}
            </p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="lg:text-xl text-sm font-bold text-gray-800 flex items-center gap-2">
              <FaClipboardList className="text-purple-500" />
              Order Summary
            </h3>
            <div className="mt-2 space-y-2 text-gray-600 text-xs md:text-sm lg:text-base">
              {/* <div className="flex justify-between">
                <p>Order Created:</p>
                <span className="font-medium">{date}</span>
              </div> */}
              <div className="flex justify-between">
                <p>Item(s) Ordered:</p>
                <span className="font-medium">
                  {data?.cart?.length || 0} Items
                </span>
              </div>
              <div className="flex justify-between">
                <p>Delivery Fee:</p>
                <span className="font-medium">
                  {data?.formattedDelivery || "No delivery fee"}
                </span>
              </div>
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <span className="font-medium">
                  {data?.formattedSubtotal || "No subtotal"}
                </span>
              </div>
              {user?.user?.balance > 0 && (
                <div className="flex justify-between">
                  <p>Credit Bal:</p>
                  <span className="font-medium">
                    {formatCurrency(user?.user?.balance, "GHS")}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <p>Order Total:</p>
                <span className="font-medium">
                  {formatCurrency(total, "GHS")}
                </span>
              </div>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between">
            <h3 className="lg:text-xl text-sm font-bold text-gray-800">
              Total Due
            </h3>
            {user?.user?.balance > 0 ? (
              <p className="font-bold text-xs md:text-sm lg:text-base">
                {formatCurrency(updatedOrderTotal, "GHS") || "No total"}
              </p>
            ) : (
              <p className=" font-bold text-xs md:text-sm lg:text-base">
                {formatCurrency(total, "GHS") || "No total"}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default InfoCard
