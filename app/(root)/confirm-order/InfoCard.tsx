import { Separator } from "@/components/ui/separator"
import React from "react"
import Card from "./Card"
import { date } from "@/lib/utils"

interface InfoCardProps {
  data: any
}

const InfoCard = ({ data }: InfoCardProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
      <Card>
        <div className="flex flex-col gap-2 lg:gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Delivery Address
            </h3>
            <div className="flex flex-col items-end md:items-start">
              <p className="text-gray-600">{data?.formData.name}</p>
              <p className="text-gray-600">{data?.formData.address}</p>
              <p className="text-gray-600">{data?.formData.city}</p>
              <p className="text-gray-600">{data?.formData.region}</p>
              <p className="text-gray-600">{data?.formData.phone}</p>
              <p className="text-gray-600">{data?.formData.email}</p>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-700">
              Billing Address
            </h3>
            <p className="text-gray-600 flex justify-end md:justify-start">
              Same as Delivery Address
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-2 lg:gap-4">
          <h3 className="text-lg font-semibold text-gray-700">Order Summary</h3>
          <div className="flex justify-between">
            <p className="text-gray-600 text-sm font-medium">Order Created:</p>
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600 text-sm font-medium">
              Quantity of Items:
            </p>
            <span className="font-medium">{data?.cart.length} Items</span>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600 text-sm font-medium">
              Estimated Delivery:
            </p>
            <span className="font-medium">Same Day</span>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600 text-sm font-medium">Subtotal:</p>
            <span className="font-medium">{data?.formattedSubtotal}</span>
          </div>

          <div className="flex justify-between">
            <p className="text-gray-600 text-sm font-medium">Delivery Fee:</p>
            <span className="font-medium">{data?.formattedDelivery}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <p>Total:</p>
            <span>{data?.formattedTotal}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default InfoCard
