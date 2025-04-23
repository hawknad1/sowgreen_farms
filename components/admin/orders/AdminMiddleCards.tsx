import { Order } from "@/types"
import React from "react"
import { ShippingInfo } from "./ShippingInfo"
import { MiddleOrderInfo } from "./MiddleOrderInfo"
import { OrderInfo } from "./OrderInfo"

interface AdminMiddleCardsProps {
  orders: Order
  balance?: number
}

const AdminMiddleCards = ({ orders, balance }: AdminMiddleCardsProps) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-none snap-x snap-mandatory">
      <div className="flex justify-between w-full gap-4">
        {/* First component - shows with second component initially */}
        <div className="flex-shrink-0 snap-start w-full lg:w-[calc(50%-0.5rem)]">
          <ShippingInfo order={orders} balance={balance} />
        </div>

        {/* Second component - shows with first or third component depending on scroll */}
        <div className="flex-shrink-0 snap-start w-full lg:w-[calc(50%-0.5rem)]">
          <MiddleOrderInfo orders={orders} balance={balance} />
        </div>

        {/* Third component - shows with second component when scrolled */}
        <div className="flex-shrink-0 snap-start w-full lg:w-[calc(50%-0.5rem)]">
          <OrderInfo orders={orders} balance={balance} />
        </div>
      </div>
    </div>
  )
}

export default AdminMiddleCards
