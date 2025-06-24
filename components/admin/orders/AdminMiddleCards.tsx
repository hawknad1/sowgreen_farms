import { Order } from "@/types"
import React, { useRef } from "react"
import { ShippingInfo } from "./ShippingInfo"
import { MiddleOrderInfo } from "./MiddleOrderInfo"
import { OrderInfo } from "./OrderInfo"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AdminMiddleCardsProps {
  orders: Order
  balance?: number
}

// const AdminMiddleCards = ({ orders, balance }: AdminMiddleCardsProps) => {
//   console.log(balance, "balance---admin")

// return (
//   <div className="w-full overflow-x-auto scrollbar-none snap-x snap-mandatory">
//     <div className="flex justify-between w-full gap-4">
//       {/* First component - shows with second component initially */}
//       <div className="flex-shrink-0 snap-start w-full lg:w-[calc(50%-0.5rem)]">
//         <ShippingInfo order={orders} balance={balance} />
//       </div>

//       {/* Second component - shows with first or third component depending on scroll */}
//       <div className="flex-shrink-0 snap-start w-full lg:w-[calc(50%-0.5rem)]">
//         <MiddleOrderInfo orders={orders} balance={balance} />
//       </div>

//       {/* Third component - shows with second component when scrolled */}
//       <div className="flex-shrink-0 snap-start w-full lg:w-[calc(50%-0.5rem)]">
//         <OrderInfo orders={orders} balance={balance} />
//       </div>
//     </div>
//   </div>
// )
const AdminMiddleCards = ({ orders, balance }: AdminMiddleCardsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.offsetWidth / 2,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.offsetWidth / 2,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative w-full">
      {/* Left Chevron Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollLeft}
        className="absolute left-0 -top-6 -translate-y-1/2 z-10 bg-gray-100 h-8 w-8 rounded-full hover:bg-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto scrollbar-none snap-x snap-mandatory px-8" // Added px-8 for button spacing
      >
        <div className="flex justify-between w-full gap-4">
          {/* First component */}
          <div className="flex-shrink-0 snap-start w-full lg:w-[calc(50%-0.5rem)]">
            <ShippingInfo order={orders} balance={balance} />
          </div>

          {/* Second component */}
          <div className="flex-shrink-0 snap-start w-full lg:w-[calc(50%-0.5rem)]">
            <MiddleOrderInfo orders={orders} balance={balance} />
          </div>

          {/* Third component */}
          <div className="flex-shrink-0 snap-start w-full lg:w-[calc(50%-0.5rem)]">
            <OrderInfo orders={orders} balance={balance} />
          </div>
        </div>
      </div>

      {/* Right Chevron Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollRight}
        className="absolute right-1 -top-6 -translate-y-1/2 z-10 bg-gray-100 w-8 h-8 rounded-full hover:bg-gray-100"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default AdminMiddleCards
