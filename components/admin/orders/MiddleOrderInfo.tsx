import { Order } from "@/types"
import { formatCurrency } from "@/lib/utils"
import Card from "@/app/(root)/confirm-order/Card"
import { deductBalance } from "@/lib/actions/deductBalance"

interface OrderInfoProps {
  orders: Order
  balance: number
}

export const MiddleOrderInfo = ({ orders, balance }: OrderInfoProps) => {
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
    creditAppliedTotal,
    paymentAction,
    last4Digits,
    cardType,
  } = orders

  const orderTotal = total + deliveryFee

  if (!orders) return null

  const typeCard = cardType?.charAt(0).toUpperCase() + cardType?.slice(1)
  const modeOfPayment =
    paymentMode?.charAt(0).toUpperCase() + paymentMode?.slice(1)

  const actionOfPayment =
    paymentAction?.charAt(0).toUpperCase() + paymentAction?.slice(1)

  return (
    <Card className="min-h-[210px] px-6 py-4 w-full">
      <div className="flex justify-between flex-wrap">
        <h3 className="text-base lg:text-lg font-bold mb-2">Order Details</h3>
      </div>
      <div className="flex flex-col gap-y-1 mt-2 lg:mt-1">
        <p className="flex justify-between text-sm lg:text-base">
          <span className=" text-neutral-600">Subtotal:</span>
          <span className="font-medium">{formatCurrency(total, "GHS")}</span>
        </p>

        <p className="flex justify-between text-sm lg:text-base">
          <span className="text-neutral-600">Delivery Fee:</span>
          <p className="font-medium ">{formatCurrency(deliveryFee, "GHS")}</p>
        </p>
        <p className="flex justify-between text-sm lg:text-base">
          <span
            className={`font-medium  ${
              orders?.creditAppliedTotal >= 0
                ? "text-emerald-500"
                : "text-red-500 "
            }`}
          >
            {orders?.creditAppliedTotal >= 0 ? "Credit Balance" : "Balance Due"}
          </span>
          <span
            className={`font-medium  ${
              orders?.creditAppliedTotal >= 0
                ? "text-emerald-500"
                : "text-red-500 "
            }`}
          >
            {formatCurrency(Math.abs(creditAppliedTotal), "GHS")}
          </span>
        </p>

        <p className="flex justify-between text-sm lg:text-base">
          <span className="text-neutral-600">Total:</span>
          <span className="font-medium">
            {formatCurrency(orderTotal, "GHS")}
          </span>
        </p>

        <p className="flex justify-between text-sm lg:text-base">
          <span className=" text-red-500">Total Due:</span>
          <p className="font-medium text-red-500">
            {formatCurrency(orders?.updatedOrderTotal, "GHS")}
          </p>
        </p>
      </div>
    </Card>
  )
}

// export const MiddleOrderInfo = ({ orders, balance }: OrderInfoProps) => {
//   const {
//     orderNumber,
//     referenceNumber,
//     total,
//     deliveryMethod,
//     deliveryFee,
//     deliveryDate,
//     dispatchRider,
//     shippingAddress,
//     paymentMode,
//     creditAppliedTotal,
//     paymentAction,
//     last4Digits,
//     cardType,
//   } = orders

//   if (!orders) return null

//   // Calculate order total including delivery fee
//   const orderTotal = total + deliveryFee

//   // Recalculate the updated order total with balance deduction
//   const { remainingAmount, updatedBalance, updatedOrderTotal } = deductBalance(
//     creditAppliedTotal,
//     orderTotal
//   )

//   const typeCard = cardType?.charAt(0).toUpperCase() + cardType?.slice(1)
//   const modeOfPayment =
//     paymentMode?.charAt(0).toUpperCase() + paymentMode?.slice(1)

//   const actionOfPayment =
//     paymentAction?.charAt(0).toUpperCase() + paymentAction?.slice(1)

//   return (
//     <Card className="min-h-[210px] px-6 py-4 w-full">
//       <div className="flex justify-between flex-wrap">
//         <h3 className="text-base lg:text-lg font-bold mb-2">Order Details</h3>
//       </div>
//       <div className="flex flex-col gap-y-1 mt-2 lg:mt-1">
//         <p className="flex justify-between text-sm lg:text-base">
//           <span className="text-neutral-600">Subtotal:</span>
//           <span className="font-medium">{formatCurrency(total, "GHS")}</span>
//         </p>

//         <p className="flex justify-between text-sm lg:text-base">
//           <span className="text-neutral-600">Delivery Fee:</span>
//           <p className="font-medium">{formatCurrency(deliveryFee, "GHS")}</p>
//         </p>

//         {creditAppliedTotal > 0 && (
//           <p className="flex justify-between text-sm lg:text-base">
//             <span className="font-medium text-emerald-500">
//               Available Credit:
//             </span>
//             <span className="font-medium text-emerald-500">
//               {formatCurrency(creditAppliedTotal, "GHS")}
//             </span>
//           </p>
//         )}

//         <p className="flex justify-between text-sm lg:text-base border-t pt-1">
//           <span className="text-neutral-600 font-medium">Total:</span>
//           <span className="font-medium">
//             {formatCurrency(orderTotal, "GHS")}
//           </span>
//         </p>

//         <p className="flex justify-between text-sm lg:text-base border-t pt-1">
//           <span className="text-red-500 font-semibold">Total Due:</span>
//           <p className="font-semibold text-red-500">
//             {formatCurrency(updatedOrderTotal, "GHS")}
//           </p>
//         </p>
//       </div>
//     </Card>
//   )
// }
