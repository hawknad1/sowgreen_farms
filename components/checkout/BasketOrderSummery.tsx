// "use client"
// import React from "react"

// import { useCartStore, useDeliveryStore, useUserStore } from "@/store"
// import { Separator } from "../ui/separator"
// import { formatCurrency } from "@/lib/utils"
// import { deductBalance } from "@/lib/actions/deductBalance"

// const BasketOrderSummery = () => {
//   const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
//   const { cartTotal } = useCartStore()
//   const { user } = useUserStore()
//   const balance = user?.user?.balance
//   const total = cartTotal + deliveryFee

//   const { updatedOrderTotal } = deductBalance(balance, total)

//   // formatCurrency
//   const formattedDelivery = formatCurrency(deliveryFee, "GHS")
//   const formattedTotal = formatCurrency(total, "GHS")

//   return (
//     <div className="">
//       <h2 className="text-lg font-semibold divide-y-4 divide-black">
//         Order Summary
//       </h2>
//       <Separator className="my-3 h-0.5" />
//       <div className="flex flex-col gap-y-2">
//         <div className="flex items-center justify-between px-2">
//           <p className="text-sm text-zinc-400/80">Subtotal</p>
//           <p className="text-sm">{formatCurrency(cartTotal, "GHS")}</p>
//         </div>
//         <div className="flex items-center justify-between px-2">
//           <p className="text-sm text-zinc-400/80">Delivery Fee</p>
//           <p className="text-sm">{formattedDelivery}</p>
//         </div>

//         <div
//           className={`flex items-center justify-between ${
//             balance < 0
//               ? "bg-red-500/15 text-red-500 py-1 rounded-sm font-medium px-2"
//               : balance >= 0
//               ? "text-emerald-500 bg-emerald-500/15 border-emerald-300/15 py-1 rounded-sm font-medium px-2"
//               : ""
//           }`}
//         >
//           <p
//             className={`text-sm  ${
//               balance < 0
//                 ? "text-red-500"
//                 : balance >= 0
//                 ? "text-emerald-500"
//                 : "text-zinc-400/80"
//             } `}
//           >
//             Credit Bal.
//           </p>
//           <p className="text-sm">{formatCurrency(balance, "GHS")}</p>
//         </div>

//         <div className="flex items-center justify-between px-2">
//           <p className="text-sm font-bold">Total</p>
//           <p className="text-sm font-bold">{formattedTotal}</p>
//         </div>

//         <div className="flex items-center justify-between px-2">
//           <p className="text-sm text-red-500 font-semibold">Total Due</p>
//           <p className="text-sm text-red-500 font-semibold">
//             {formatCurrency(updatedOrderTotal, "GHS")}
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default BasketOrderSummery

"use client"
import React from "react"
import { useCartStore, useDeliveryStore, useUserStore } from "@/store"
import { Separator } from "../ui/separator"
import { formatCurrency } from "@/lib/utils"
import { deductBalance } from "@/lib/actions/deductBalance"

const BasketOrderSummery = () => {
  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const { cartTotal } = useCartStore()
  const { user } = useUserStore()
  const balance = user?.user?.balance
  const total = cartTotal + deliveryFee
  const { updatedOrderTotal } = deductBalance(balance, total)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
      <Separator className="bg-gray-200" />

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">
            {formatCurrency(cartTotal, "GHS")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium">
            {formatCurrency(deliveryFee, "GHS")}
          </span>
        </div>

        {/* <div
          className={`flex justify-between p-2 rounded-md ${
            balance < 0
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          <span>Credit Balance</span>
          <span className="font-medium">{formatCurrency(balance, "GHS")}</span>
        </div> */}
        <div
          className={`flex justify-between p-2 rounded-md ${
            balance < 0
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          <span>{balance < 0 ? "Balance Due" : "Credit Balance"}</span>
          <span className="font-medium">
            {formatCurrency(Math.abs(balance), "GHS")}
          </span>
        </div>

        <Separator className="bg-gray-200" />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total, "GHS")}</span>
        </div>

        <div className="flex justify-between text-red-600 font-semibold">
          <span>Total Due</span>
          <span>{formatCurrency(updatedOrderTotal, "GHS")}</span>
        </div>
      </div>
    </div>
  )
}

export default BasketOrderSummery
