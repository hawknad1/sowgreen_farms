// import { Order } from "@/types"
// import { formatCurrency } from "@/lib/utils"
// import Card from "@/app/(root)/confirm-order/Card"

// interface OrderInfoProps {
//   orders: Order
//   balance: number
// }

// export const MiddleOrderInfo = ({ orders, balance }: OrderInfoProps) => {
//   const {
//     orderNumber,
//     referenceNumber,
//     total,
//     subtotal,
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

//   console.log(total, "total")
//   console.log(subtotal, "subtotal")

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
//           <span className=" text-neutral-600">Subtotal:</span>
//           <span className="font-medium">{formatCurrency(subtotal, "GHS")}</span>
//         </p>

//         <p className="flex justify-between text-sm lg:text-base">
//           <span className="text-neutral-600">Delivery Fee:</span>
//           <p className="font-medium ">{formatCurrency(deliveryFee, "GHS")}</p>
//         </p>
//         <p className="flex justify-between text-sm lg:text-base">
//           <span
//             className={`font-medium  ${
//               orders?.creditAppliedTotal >= 0
//                 ? "text-emerald-500"
//                 : "text-red-500 "
//             }`}
//           >
//             Credit Bal.:
//           </span>
//           <span
//             className={`font-medium  ${
//               orders?.creditAppliedTotal >= 0
//                 ? "text-emerald-500"
//                 : "text-red-500 "
//             }`}
//           >
//             {formatCurrency(creditAppliedTotal, "GHS")}
//           </span>
//         </p>

//         <p className="flex justify-between text-sm lg:text-base">
//           <span className="text-neutral-600">Total:</span>
//           <span className="font-medium">{formatCurrency(total, "GHS")}</span>
//         </p>

//         <p className="flex justify-between text-sm lg:text-base">
//           <span className=" text-red-500">Total Due:</span>
//           <p className="font-medium text-red-500">
//             {formatCurrency(orders?.updatedOrderTotal, "GHS")}
//           </p>
//         </p>
//       </div>
//     </Card>
//   )
// }

import { Order } from "@/types"
import { formatCurrency } from "@/lib/utils"
import Card from "@/app/(root)/confirm-order/Card"

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
            Credit Bal.:
          </span>
          <span
            className={`font-medium  ${
              orders?.creditAppliedTotal >= 0
                ? "text-emerald-500"
                : "text-red-500 "
            }`}
          >
            {formatCurrency(creditAppliedTotal, "GHS")}
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
