import { Separator } from "@/components/ui/separator"
import React, { useMemo } from "react"
import Card from "./Card"
import { date, formatCurrency } from "@/lib/utils"

interface InfoCardProps {
  data: any
}

const InfoCard = ({ data }: InfoCardProps) => {
  const shipMethod = () => {
    const deliveryMethod = data?.formData?.deliveryMethod?.toLowerCase() || ""

    switch (deliveryMethod) {
      case "Wednesday - DZORWULU - 11AM-5PM":
        return "Pick up - Dzorwolu"
      case "SATURDAY - WEB DuBOIS CENTER - 10AM-3PM":
        return "Pick up - Dubois Center"
      case "same-day-delivery":
        return "Same Day Delivery"
      case "next-day-delivery":
        return "Next Day Delivery"
      default:
        return deliveryMethod || "Not specified"
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
      <Card>
        <div className="flex flex-col gap-2 lg:gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Delivery Address
            </h3>
            <div className="flex flex-col items-end md:items-start">
              <p className="text-gray-600">
                {data?.formData?.name || "No name"}
              </p>
              <p className="text-gray-600">
                {data?.formData?.address || "No address"}
              </p>
              <p className="text-gray-600">
                {data?.formData?.city || "No city"}
              </p>
              <p className="text-gray-600">
                {data?.formData?.region || "No region"}
              </p>
              <p className="text-gray-600">
                {data?.formData?.phone || "No phone"}
              </p>
              <p className="text-gray-600">
                {data?.formData?.email || "No email"}
              </p>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-700">
              Delivery Method
            </h3>
            <p className="text-gray-600 flex justify-end md:justify-start">
              {shipMethod()}
            </p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex flex-col gap-2 lg:gap-4">
          <div className="">
            <h3 className="text-lg font-semibold text-gray-700">
              Order Summary
            </h3>
            <div className="flex flex-col gap-3.5 mt-2 items-start w-full">
              <div className="flex items-center justify-between w-full">
                <p className="text-gray-600 font-medium">Order Created:</p>
                <span className="font-medium">{date}</span>
              </div>

              <div className="flex items-center justify-between w-full">
                <p className="text-gray-600 font-medium">Item(s) Ordered:</p>
                <span className="font-medium">
                  {data?.cart?.length || 0} Items
                </span>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="text-gray-600 font-medium">Delivery Fee:</p>
                <span className="font-medium">
                  {data?.formattedDelivery || "No delivery fee"}
                </span>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="text-gray-600 font-medium">Subtotal:</p>
                <span className="font-medium">
                  {data?.formattedSubtotal || "No subtotal"}
                </span>
              </div>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="w-full flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Order Total</h3>
            <p className="text-gray-600 flex justify-end md:justify-start">
              {formatCurrency(data?.total + data?.deliveryFee, "GHS") ||
                "No total"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default InfoCard
