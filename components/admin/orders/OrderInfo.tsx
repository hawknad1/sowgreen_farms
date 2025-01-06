import { Order } from "@/types"
import { useMemo } from "react"
import ModifyOrderDetailsDialog from "./dialogs/ModifyOrderDetailsDialog"
import { formatCurrency } from "@/lib/utils"

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
      <div className="flex justify-between flex-wrap">
        <h3 className="text-base lg:text-lg font-bold mb-2">Order Details</h3>

        <ModifyOrderDetailsDialog order={orders} />
      </div>
      <div className="flex flex-col gap-y-1 mt-2 lg:mt-1">
        <p className="flex justify-between text-sm lg:text-base">
          <span className=" text-neutral-600">Order Number: </span>{" "}
          <span className="font-medium">{orderNumber}</span>
        </p>
        <p className="flex justify-between text-sm lg:text-base">
          <span className=" text-neutral-600">Order Total:</span>
          <span className="font-medium">
            {formatCurrency(orderTotal, "GHS")}
          </span>
        </p>
        {cardType ? (
          <p className=" flex justify-between text-sm lg:text-base">
            <span className=" text-neutral-600">Payment Method:</span>
            <span className="font-medium"> {typeCard}</span>
          </p>
        ) : (
          <p className=" flex justify-between text-sm lg:text-base">
            <span className=" text-neutral-600">Payment Method: </span>
            <span className="font-medium">{modeOfPayment}</span>
          </p>
        )}
        <p className="flex justify-between text-sm lg:text-base">
          <span className=" text-neutral-600">Delivery Date:</span>
          <span className="font-medium">{deliveryDate}</span>
        </p>

        <p className="flex justify-between text-sm lg:text-base">
          <span className=" text-neutral-600">Delivery Method: </span>{" "}
          {shippingAddress?.deliveryMethod}
        </p>
      </div>
    </div>
  )
}
