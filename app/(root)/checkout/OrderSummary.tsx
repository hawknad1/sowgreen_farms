// "use client"
// import React from "react"
// import { formatCurrency } from "@/lib/utils"
// import { useCartStore, useUserStore } from "@/store"
// import BasketCartItems from "@/components/basket/BasketCartItems"
// import { deductBalance } from "@/lib/actions/deductBalance"

// const OrderSummary = ({
//   deliveryFee,
// }: {
//   selectedPickupOption: string
//   selectedDeliveryMethod: string
//   deliveryFee: number
// }) => {
//   const { cartTotal } = useCartStore()
//   const { user } = useUserStore()

//   const total = cartTotal + deliveryFee
//   const subtotal = formatCurrency(cartTotal, "GHS")
//   const formattedDelivery = formatCurrency(deliveryFee, "GHS")
//   const formattedTotal = formatCurrency(total, "GHS")
//   const balance = user?.user?.balance

//   const { updatedOrderTotal } = deductBalance(balance, total)

//   return (
//     <div className="flex flex-col justify-between h-fit rounded-md">
//       <div className="overflow-y-auto max-h-[400px] scrollbar-hide">
//         <div className="flex items-center">
//           <BasketCartItems isCheckout={true} />
//         </div>
//       </div>
//       <div className="bg-white flex flex-col py-4 border-t border-neutral-200">
//         <div className="flex flex-col space-y-3">
//           <div className="flex items-center justify-between">
//             <p className="text-sm  md:text-base text-neutral-500 font-medium">
//               Subtotal
//             </p>
//             <p className="font-semibold text-sm">{subtotal}</p>
//           </div>
//           <div className="flex items-center justify-between">
//             <p className="text-sm  md:text-base text-neutral-500 font-medium">
//               Delivery Fee
//             </p>
//             <p className="font-semibold text-sm">{formattedDelivery}</p>
//           </div>
//           <div
//             className={`flex items-center justify-between ${
//               user?.user?.balance < 0
//                 ? "bg-red-500/15 text-red-500 py-1 rounded-sm font-medium px-2"
//                 : user?.user?.balance >= 0
//                 ? "text-emerald-500 bg-emerald-500/15 border-emerald-300/15 py-1 rounded-sm font-medium px-2"
//                 : ""
//             }`}
//           >
//             <p
//               className={`text-sm md:text-base  ${
//                 balance < 0
//                   ? "text-red-500"
//                   : balance >= 0
//                   ? "text-emerald-500"
//                   : "text-zinc-400/80"
//               } `}
//             >
//               Credit Bal.
//             </p>
//             <p className="font-semibold text-sm">
//               {formatCurrency(balance, "GHS")}
//             </p>
//           </div>
//           <div className="flex items-center justify-between text-lg">
//             <p className="text-sm  md:text-base text-neutral-500 font-medium">
//               Total
//             </p>
//             <span className="font-semibold text-sm">{formattedTotal}</span>
//           </div>

//           <div className="flex items-center justify-between text-lg">
//             <>
//               <p className="text-sm  md:text-base text-red-500 font-bold">
//                 Total Due
//               </p>
//               <p className=" font-bold text-red-500">
//                 {formatCurrency(updatedOrderTotal, "GHS")}
//               </p>
//             </>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default OrderSummary

"use client"
import React from "react"
import { formatCurrency } from "@/lib/utils"
import { useCartStore, useUserStore } from "@/store"
import BasketCartItems from "@/components/basket/BasketCartItems"
import { deductBalance } from "@/lib/actions/deductBalance"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import BasketCartItemsPopover from "@/components/BasketCartItemsPopover"

const OrderSummary = ({
  deliveryFee,
}: {
  selectedPickupOption: string
  selectedDeliveryMethod: string
  deliveryFee: number
}) => {
  const { cartTotal } = useCartStore()
  const { user } = useUserStore()

  const total = cartTotal + deliveryFee
  const subtotal = formatCurrency(cartTotal, "GHS")
  const formattedDelivery = formatCurrency(deliveryFee, "GHS")
  const formattedTotal = formatCurrency(total, "GHS")
  const balance = user?.user?.balance

  const { updatedOrderTotal } = deductBalance(balance, total)

  return (
    <div className="flex flex-col justify-between h-fit">
      <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        <div className="flex items-center">
          {/* <BasketCartItems isCheckout={true} /> */}
          <BasketCartItems isCheckout={true} />
        </div>
      </div>
      <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Subtotal</p>
          <p className="font-medium">{subtotal}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Delivery Fee</p>
          <p className="font-medium">{formattedDelivery}</p>
        </div>

        {/* <div
          className={`flex items-center justify-between p-2 rounded-lg ${
            user?.user?.balance < 0
              ? "bg-red-50 text-red-600"
              : user?.user?.balance >= 0
              ? "bg-green-50 text-green-600"
              : "bg-gray-50"
          }`}
        >
          <p className="text-sm">Credit Balance</p>
          <p className="font-medium">{formatCurrency(balance, "GHS")}</p>
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

        <div className="flex items-center justify-between pt-2">
          <p className="text-sm font-semibold text-gray-700">Total</p>
          <p className="font-semibold">{formattedTotal}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <p className="text-sm md:text-base lg:text-lg font-bold text-primary">
            Total Due
          </p>
          <Badge
            variant="outline"
            className="px-3 py-1 text-sm md:text-base lg:text-lg font-bold border-primary text-primary"
          >
            {formatCurrency(updatedOrderTotal, "GHS")}
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
