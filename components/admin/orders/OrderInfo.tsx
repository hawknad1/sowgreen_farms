import { Order } from "@/types"
import { useMemo } from "react"
import ModifyOrderDetailsDialog from "./dialogs/ModifyOrderDetailsDialog"

export const OrderInfo = ({ orders }: { orders: Order }) => {
  const {
    orderNumber,
    referenceNumber,
    total,
    deliveryMethod,
    deliveryFee,
    deliveryDate,
    dispatchRider,
    shippingAddress,
    paymentMode,
    cardType,
  } = orders

  const orderTotal = total + deliveryFee

  console.log(orders, "orderrsss!!!")

  // const deliveryMethodLabel = useMemo(() => {
  //   switch (deliveryMethod) {
  //     case "DZORWULU":
  //       return "Pick up - Dzorwolu"
  //     case "WEB DuBOIS CENTER":
  //       return "Pick up - Dubois Center"
  //     case "wednesday-delivery":
  //       return `Home Delivery - ${deliveryMethod}`
  //     case "saturday-delivery":
  //       return `Home Delivery - ${deliveryMethod}`
  //     default:
  //       return deliveryMethod || "Not specified"
  //   }
  // }, [deliveryMethod])

  // const deliveryMethodLabel = useMemo(() => {
  //   switch (deliveryMethod) {
  //     case "Wednesday - DZORWULU - 11AM-5PM":
  //       return "Pick up - Dzorwolu"
  //     case "SATURDAY - WEB DuBOIS CENTER - 10AM-3PM":
  //       return "Pick up - Dubois Center"
  //     case "wednesday-delivery":
  //       return `Home Delivery - ${deliveryMethod}`
  //     case "saturday-delivery":
  //       return `Home Delivery - ${deliveryMethod}`
  //     default:
  //       return deliveryMethod || "Not specified"
  //   }
  // }, [deliveryMethod])

  if (!orders) return null

  const typeCard = cardType?.charAt(0).toUpperCase() + cardType?.slice(1)
  const modeOfPayment =
    paymentMode?.charAt(0).toUpperCase() + paymentMode?.slice(1)

  return (
    <div className="w-full border border-neutral-200 px-6 py-4 rounded-lg">
      <div className="flex w-full justify-between mb-1 ">
        <h3 className="text-base lg:text-lg font-bold mb-2">Order Details</h3>

        <ModifyOrderDetailsDialog order={orders} />
      </div>
      <div className="flex flex-col gap-y-1">
        <p className="font-medium flex justify-between">
          <span className="text-sm text-neutral-500">Order Number: </span>{" "}
          {orderNumber}
        </p>
        <p className="font-medium flex justify-between">
          <span className="text-sm text-neutral-500">Order Total: </span> GHS{" "}
          {orderTotal.toFixed(2)}
        </p>
        {cardType ? (
          <p className="font-medium flex justify-between">
            <span className="text-sm text-neutral-500">Payment Method: </span>
            {typeCard}
          </p>
        ) : (
          <p className="font-medium flex justify-between">
            <span className="text-sm text-neutral-500">Payment Method: </span>
            {modeOfPayment}
          </p>
        )}
        <p className="font-medium flex justify-between">
          <span className="text-sm text-neutral-500">Delivery Date: </span>
          {deliveryDate}
        </p>

        <p className="font-medium flex justify-between">
          <span className="text-sm text-neutral-500">Delivery Method: </span>{" "}
          {shippingAddress?.deliveryMethod}
        </p>
      </div>
    </div>
  )
}
