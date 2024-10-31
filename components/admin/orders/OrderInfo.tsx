import { Order } from "@/types"
import { useMemo } from "react"

export const OrderInfo = ({ orders }: { orders: Order }) => {
  const {
    orderNumber,
    referenceNumber,
    total,
    deliveryMethod,
    deliveryFee,
    dispatchRider,
  } = orders

  const deliveryMethodLabel = useMemo(() => {
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
  }, [deliveryMethod])

  if (!orders) return null

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold mb-2">Order Details</h3>
      <p className="font-medium">
        <span className="text-sm text-neutral-500">Order Number: </span>{" "}
        {orderNumber}
      </p>
      <p className="font-medium">
        <span className="text-sm text-neutral-500">Delivery Fee: </span> GHS{" "}
        {deliveryFee?.toFixed(2)}
      </p>
      <p className="font-medium">
        <span className="text-sm text-neutral-500">Dispatch Rider: </span>
        {dispatchRider}
      </p>
      <p className="font-medium">
        <span className="text-sm text-neutral-500">Order Total: </span> GHS{" "}
        {total}
      </p>
      <p className="font-medium">
        <span className="text-sm text-neutral-500">Delivery Method: </span>{" "}
        {deliveryMethodLabel}
      </p>
    </div>
  )
}
