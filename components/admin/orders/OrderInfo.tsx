import { Order } from "@/types"
import { useMemo } from "react"
import ModifyOrderDetailsDialog from "./dialogs/ModifyOrderDetailsDialog"
import { formatCurrency } from "@/lib/utils"
import Card from "@/app/(root)/confirm-order/Card"
import { formatDeliveryDate } from "@/lib/formateDeliveryDate"

interface OrderInfoProps {
  orders: Order
  balance: number
}

export const OrderInfo = ({ orders, balance }: OrderInfoProps) => {
  const {
    orderNumber,
    referenceNumber,
    total,
    deliveryFee,
    deliveryDate,
    dispatchRider,
    shippingAddress,
    paymentMode,
    creditAppliedTotal,
    paymentAction,
    last4Digits,
    cardType,
    createdAt,
  } = orders

  const date = new Date(createdAt)
  const dateplaced = formatDeliveryDate(date)

  function formatDeliveryMethod(method: string) {
    const trimmed = method.trim().toLowerCase()

    if (trimmed.startsWith("home delivery")) {
      return "Home Delivery"
    }

    if (trimmed.startsWith("pickup-")) {
      return method.split("pickup-")[1].trim()
    }

    // if (trimmed.startsWith("pickup-")) {
    //   const location = method.split("pickup-")[1].trim()
    //   return `PICK UP @ - ${location}`
    // }

    return method.trim() // fallback
  }

  // const cleanDeliveryMethod = deliveryMethod.split("-")[0].trim()

  const deliveryMethod = formatDeliveryMethod(shippingAddress?.deliveryMethod)
  console.log(deliveryDate, "deliveryDate")
  console.log(shippingAddress?.deliveryMethod, "deliveryMethod")

  console.log(
    formatDeliveryMethod(shippingAddress?.deliveryMethod),
    "deliveryMethod====="
  )

  if (!orders) return null

  const typeCard = cardType?.charAt(0).toUpperCase() + cardType?.slice(1)
  const modeOfPayment =
    paymentMode?.charAt(0).toUpperCase() + paymentMode?.slice(1)

  const actionOfPayment =
    paymentAction?.charAt(0).toUpperCase() + paymentAction?.slice(1)

  return (
    <Card className="min-h-[210px] px-6 py-4">
      <div className="flex justify-between flex-wrap">
        <h3 className="text-base lg:text-lg font-bold mb-2">
          Modify Order Details
        </h3>

        <ModifyOrderDetailsDialog order={orders} />
      </div>
      <div className="flex flex-col gap-y-1 mt-2 lg:mt-1">
        <p className="flex justify-between text-sm lg:text-base">
          <span className=" text-neutral-600">Date Placed:</span>
          <span className="font-medium">{dateplaced}</span>
        </p>
        <p className="flex justify-between text-sm lg:text-base">
          <span className=" text-neutral-600">Delivery Date:</span>
          <span className="font-medium">{deliveryDate}</span>
        </p>

        <p className="flex justify-between text-sm lg:text-base">
          <span className=" text-neutral-600">Delivery Method: </span>{" "}
          {deliveryMethod}
        </p>

        {cardType ? (
          <p className=" flex justify-between text-sm lg:text-base">
            <span className=" text-neutral-600">Payment Method:</span>
            <span className="font-medium ">
              {typeCard} - xxxx {last4Digits}{" "}
              <span className="bg-emerald-500/15 text-emerald-500 px-6 rounded-full">
                {actionOfPayment}
              </span>
            </span>
          </p>
        ) : cardType === "" && paymentMode === "mobile_money" ? (
          <p className="flex justify-between text-sm lg:text-base">
            <span className=" text-neutral-600">Payment Method:</span>
            <span className="font-medium">
              Mobile Money - {last4Digits}{" "}
              <span className="bg-emerald-500/15 text-emerald-500 px-6 rounded-full">
                {actionOfPayment}
              </span>
            </span>
          </p>
        ) : (
          <p className=" flex justify-between text-sm lg:text-base">
            <span className=" text-neutral-600">Payment Method: </span>
            <span
              className={`font-medium px-4 rounded-full ${
                paymentAction === "paid"
                  ? "bg-emerald-500/15 text-emerald-500"
                  : "bg-red-500/15 text-red-500"
              }`}
            >
              {actionOfPayment}
            </span>
          </p>
        )}
      </div>
    </Card>
  )
}
