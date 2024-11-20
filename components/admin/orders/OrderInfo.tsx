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
    paymentMode,
    cardType,
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

  const typeCard = cardType?.charAt(0).toUpperCase() + cardType?.slice(1)
  const modeOfPayment =
    paymentMode?.charAt(0).toUpperCase() + paymentMode?.slice(1)

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
      {cardType ? (
        <p className="font-medium">
          <span className="text-sm text-neutral-500">Payment Method: </span>
          {typeCard}
        </p>
      ) : (
        <p className="font-medium">
          <span className="text-sm text-neutral-500">Payment Method: </span>
          {modeOfPayment}
        </p>
      )}
      <p className="font-medium">
        <span className="text-sm text-neutral-500">Order Total: </span> GHS{" "}
        {(total + deliveryFee).toFixed(2)}
      </p>
      <p className="font-medium">
        <span className="text-sm text-neutral-500">Delivery Method: </span>{" "}
        {deliveryMethodLabel}
      </p>
    </div>
  )
}
