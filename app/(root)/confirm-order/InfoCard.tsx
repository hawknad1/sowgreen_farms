// "use client"
// import { Separator } from "@/components/ui/separator"
// import React, { useMemo } from "react"
// import Card from "./Card"
// import { date, formatCurrency } from "@/lib/utils"
// import { useDeliveryStore, useUserListStore, useUserStore } from "@/store"
// import { FaMapMarkerAlt, FaTruck, FaClipboardList } from "react-icons/fa"
// import { deductBalance } from "@/lib/actions/deductBalance"

// interface InfoCardProps {
//   data: any
// }

// const InfoCard = ({ data }: InfoCardProps) => {
//   const deliveryMethod = data?.formData?.deliveryMethod?.trim()?.toUpperCase()
//   const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
//   const { user } = useUserStore()
//   // const { balance } = useUserListStore()

//   let total = data?.total + deliveryFee
//   const balance = user?.user?.balance

//   const { updatedOrderTotal } = deductBalance(user?.user?.balance, total)

//   const deliveryMethodLabel = useMemo(() => {
//     switch (deliveryMethod) {
//       case "DZORWULU":
//         return "PICK UP - DZORWULU"
//       case "WEB DuBOIS CENTER":
//         return `PICK UP - WEB DuBOIS CENTER`
//       case `Home Delivery - ${deliveryMethod}`:
//         return `Home Delivery - ${deliveryMethod}`
//       default:
//         return deliveryMethod || "Not specified"
//     }
//   }, [deliveryMethod])

//   const deliveryMethodDisplay = useMemo(() => {
//     const normalizedDeliveryMethod = deliveryMethod.trim().toLowerCase()

//     // Check if the delivery method includes "home delivery"
//     if (normalizedDeliveryMethod.includes("home delivery")) {
//       return deliveryMethod // Return the original delivery method
//     }

//     // Otherwise, prepend "PICK UP @" to the delivery method
//     return (
//       <div className="flex items-center gap-x-2">
//         <p className="text-xs md:text-sm">PICK UP @</p>
//         <p className="font-semibold text-xs md:text-sm lg:text-base">{`${deliveryMethod} - ${data?.deliveryDate}`}</p>
//       </div>
//     )
//   }, [deliveryMethod])

//   return (
//     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//       <Card className="h-fit md:h-full">
//         <div className="flex flex-col gap-4">
//           <div>
//             <h3 className="lg:text-xl text-sm font-bold text-gray-800 flex items-center gap-2">
//               <FaMapMarkerAlt className="text-red-500" />
//               Delivery Address
//             </h3>
//             <div className="mt-2 space-y-1 text-gray-600 text-xs md:text-base">
//               <p>{data?.formData?.name || "No name"}</p>
//               <p>
//                 {data?.formData?.address || "No address"},{" "}
//                 {data?.formData?.city || "No city"}
//               </p>
//               <p>{data?.formData?.region || "No region"}</p>
//               <p>{data?.formData?.phone || "No phone"}</p>
//               <p>{data?.formData?.email || "No email"}</p>
//             </div>
//           </div>
//           <Separator className="" />
//           <div>
//             <h3 className="lg:text-xl text-sm font-bold text-gray-800 flex items-center gap-2">
//               <FaTruck className="text-green-500" />
//               Delivery Method
//             </h3>

//             <p className="py-1 text-xs md:text-sm lg:text-base">
//               {deliveryMethodDisplay}
//             </p>
//           </div>
//         </div>
//       </Card>
//       <Card>
//         <div className="flex flex-col gap-4">
//           <div>
//             <h3 className="lg:text-xl text-sm font-bold text-gray-800 flex items-center gap-2">
//               <FaClipboardList className="text-purple-500" />
//               Order Summary
//             </h3>
//             <div className="mt-2 space-y-2 text-gray-600 text-xs md:text-sm lg:text-base">
//               <div className="flex justify-between">
//                 <p>Item(s) Ordered:</p>
//                 <span className="font-medium">
//                   {data?.cart?.length || 0} Items
//                 </span>
//               </div>

//               <div className="flex justify-between">
//                 <p>Subtotal:</p>
//                 <span className="font-medium">
//                   {data?.formattedSubtotal || "No subtotal"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <p>Delivery Fee:</p>
//                 <span className="font-medium">
//                   {data?.formattedDelivery || "No delivery fee"}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <p
//                   className={`${
//                     user?.user?.balance >= 0
//                       ? "text-emerald-500"
//                       : "text-red-500"
//                   }`}
//                 >
//                   Credit Bal:
//                 </p>
//                 <span
//                   className={`${
//                     user?.user?.balance >= 0
//                       ? "text-emerald-500"
//                       : "text-red-500"
//                   } font-medium`}
//                 >
//                   {formatCurrency(user?.user?.balance, "GHS")}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <p>Total:</p>
//                 <span className="font-medium">
//                   {formatCurrency(total, "GHS")}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <Separator className="my-2" />
//           <div className="flex justify-between">
//             <h3 className="lg:text-xl text-sm font-bold text-red-500">
//               Total Due
//             </h3>
//             {balance > 0 || balance < 0 ? (
//               <p className="font-bold text-xs md:text-sm text-red-500 lg:text-base">
//                 {formatCurrency(updatedOrderTotal, "GHS") || "No total"}
//               </p>
//             ) : (
//               <p className=" font-bold text-red-500 text-xs md:text-sm lg:text-base">
//                 {formatCurrency(total, "GHS") || "No total"}
//               </p>
//             )}
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }

// export default InfoCard

"use client"
import { Separator } from "@/components/ui/separator"
import React, { useMemo } from "react"
import Card from "./Card"
import { formatCurrency } from "@/lib/utils"
import { useDeliveryStore, useUserStore } from "@/store"
import { FaMapMarkerAlt, FaTruck, FaClipboardList } from "react-icons/fa"
import { deductBalance } from "@/lib/actions/deductBalance"
import { Skeleton } from "@/components/ui/skeleton"

interface InfoCardProps {
  data: any
}

const InfoCard = ({ data }: InfoCardProps) => {
  const deliveryMethod = data?.formData?.deliveryMethod?.trim()?.toUpperCase()
  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const { user } = useUserStore()

  const combinedOrderTotal = data?.total
  const balance = user?.user?.balance
  const { updatedOrderTotal, deductedBalance } = deductBalance(
    balance,
    combinedOrderTotal
  )

  const deliveryMethodDisplay = useMemo(() => {
    const normalizedDeliveryMethod = deliveryMethod?.trim().toLowerCase()

    if (!deliveryMethod) {
      return (
        <span className="text-gray-500 italic">
          Delivery method not specified.
        </span>
      )
    }

    if (normalizedDeliveryMethod?.includes("home delivery")) {
      return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-2 text-sm sm:text-base">
          <p className="font-semibold">{deliveryMethod}</p>
          <p className="text-xs text-gray-500">on {data?.deliveryDate}</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-2 text-sm sm:text-base">
        <p className="text-gray-700">PICK UP @</p>
        <p className="font-semibold">{`${deliveryMethod} `}</p>
        <p className="text-xs text-gray-500">on {data?.deliveryDate}</p>
      </div>
    )
  }, [deliveryMethod, data?.deliveryDate])

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <Separator className="my-6" />
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Delivery Address & Method Card */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-6">
          {/* Delivery Address Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3 mb-4">
              <FaMapMarkerAlt className="text-red-500 text-lg" />
              Delivery Address
            </h3>
            <div className="space-y-2 text-gray-700 text-sm sm:text-base leading-relaxed">
              <p className="font-semibold">{data?.formData?.name || "N/A"}</p>
              <p>
                {data?.formData?.address || "N/A"},{" "}
                {data?.formData?.city || "N/A"}
              </p>
              <p>{data?.formData?.region || "N/A"}</p>
              <p className="font-medium">{data?.formData?.phone || "N/A"}</p>
              <p className="text-xs text-gray-500">
                {data?.formData?.email || "N/A"}
              </p>
            </div>
          </div>

          <Separator className="bg-gray-200 my-4" />

          {/* Delivery Method Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3 mb-4">
              <FaTruck className="text-green-500 text-lg" />
              Delivery Method
            </h3>
            <div className="mt-2 text-gray-700">{deliveryMethodDisplay}</div>
          </div>
        </div>
      </Card>

      {/* Order Summary Card */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-6">
          {/* Order Summary Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3 mb-4">
              <FaClipboardList className="text-purple-500 text-lg" />
              Order Summary
            </h3>
            <div className="space-y-3 text-gray-700 text-sm sm:text-base">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <p>Item(s) Ordered:</p>
                <span className="font-medium">
                  {data?.cart?.length || 0} Items
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <p>Subtotal:</p>
                <span className="font-medium">
                  {data?.formattedSubtotal || formatCurrency(0, "GHS")}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <p>Delivery Fee:</p>
                <span className="font-medium">
                  {data?.formattedDelivery || formatCurrency(0, "GHS")}
                </span>
              </div>
              {balance !== undefined && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <p
                    className={balance >= 0 ? "text-green-600" : "text-red-600"}
                  >
                    Your Credit:
                  </p>
                  <span
                    className={balance >= 0 ? "text-green-600" : "text-red-600"}
                  >
                    {formatCurrency(balance, "GHS")}
                  </span>
                </div>
              )}
              {deductedBalance > 0 && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <p className="text-green-600">Credit Applied:</p>
                  <span className="text-green-600">
                    -{formatCurrency(deductedBalance, "GHS")}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Order Total:
                </h3>
                <span className="font-semibold text-lg text-primary">
                  {formatCurrency(combinedOrderTotal, "GHS")}
                </span>
              </div>
            </div>
          </div>

          {deductedBalance > 0 && (
            <div className="border-t pt-4 mt-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-red-600">
                Amount to Pay:
              </h3>
              <p className="font-semibold text-lg text-red-600">
                {formatCurrency(updatedOrderTotal, "GHS")}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default InfoCard

// // InfoCard.tsx
// "use client"
// import { Separator } from "@/components/ui/separator"
// import React, { useMemo } from "react"
// import Card from "./Card" // Ensure Card.tsx is updated as below!
// import { formatCurrency } from "@/lib/utils" // Removed 'date' utility as it seems unused
// import { useDeliveryStore, useUserStore } from "@/store"
// import { FaMapMarkerAlt, FaTruck, FaClipboardList } from "react-icons/fa"
// import { deductBalance } from "@/lib/actions/deductBalance"

// interface InfoCardProps {
//   data: any
// }

// const InfoCard = ({ data }: InfoCardProps) => {
//   const deliveryMethod = data?.formData?.deliveryMethod?.trim()?.toUpperCase()
//   const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
//   const { user } = useUserStore()

//   const combinedOrderTotal = data?.total
//   const balance = user?.user?.balance
//   const { updatedOrderTotal, deductedBalance } = deductBalance(
//     balance,
//     combinedOrderTotal
//   )

//   const deliveryMethodDisplay = useMemo(() => {
//     const normalizedDeliveryMethod = deliveryMethod?.trim().toLowerCase()

//     if (!deliveryMethod) {
//       return (
//         <span className="text-gray-500 italic">
//           Delivery method not specified.
//         </span>
//       )
//     }

//     if (normalizedDeliveryMethod?.includes("home delivery")) {
//       return (
//         <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-2 text-sm sm:text-base">
//           <p className="font-semibold">{deliveryMethod}</p>
//           <p className="text-xs text-gray-500">on {data?.deliveryDate}</p>
//         </div>
//       )
//     }

//     // For Pickup
//     return (
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-2 text-sm sm:text-base">
//         <p className="text-gray-700">PICK UP @</p>
//         <p className="font-semibold">{`${deliveryMethod} `}</p>
//         <p className="text-xs text-gray-500">on {data?.deliveryDate}</p>
//       </div>
//     )
//   }, [deliveryMethod, data?.deliveryDate])

//   return (
//     // The grid for the two InfoCard sections
//     <div className="flex flex-col md:flex-row gap-6 md:gap-8">
//       {/* Delivery Address & Method Card */}
//       <Card className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-white rounded-lg shadow-md border border-gray-200">
//         {" "}
//         {/* Increased overall padding here */}
//         <div className="space-y-8">
//           {" "}
//           {/* Increased internal space-y for major sections */}
//           {/* Delivery Address Section */}
//           <div>
//             <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-3 mb-4">
//               {" "}
//               {/* Increased mb */}
//               <FaMapMarkerAlt className="text-red-500 text-xl" />
//               Delivery Address
//             </h3>
//             <div className="space-y-2 text-gray-700 text-sm md:text-base leading-relaxed">
//               {" "}
//               {/* More vertical space, relaxed line height */}
//               <p className="font-semibold">{data?.formData?.name || "N/A"}</p>
//               <p>
//                 {data?.formData?.address || "N/A"},{" "}
//                 {data?.formData?.city || "N/A"}
//               </p>
//               <p>{data?.formData?.region || "N/A"}</p>
//               <p className="font-medium">{data?.formData?.phone || "N/A"}</p>
//               <p className="text-xs text-gray-500">
//                 {data?.formData?.email || "N/A"}
//               </p>
//             </div>
//           </div>
//           <Separator className="bg-gray-200 h-px my-6" />{" "}
//           {/* Increased vertical margin */}
//           {/* Delivery Method Section */}
//           <div>
//             <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-3 mb-4">
//               {" "}
//               {/* Increased mb */}
//               <FaTruck className="text-green-500 text-xl" />
//               Delivery Method
//             </h3>
//             <div className="mt-2 text-gray-700">{deliveryMethodDisplay}</div>
//           </div>
//         </div>
//       </Card>

//       {/* Order Summary Card */}
//       <Card className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-white rounded-lg shadow-md border border-gray-200">
//         {/* Increased overall padding here */}
//         <div className="space-y-8">
//           {/* Increased internal space-y for major sections */}
//           {/* Order Summary Section */}
//           <div>
//             <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-3 mb-4">
//               {/* Increased mb */}
//               <FaClipboardList className="text-purple-500 text-xl" />
//               Order Summary
//             </h3>
//             <div className="space-y-3.5 text-gray-700 text-sm md:text-base">
//               {/* More vertical space between price lines */}
//               <div className="flex justify-between items-center pb-2 border-b border-gray-100">
//                 {/* Increased pb */}
//                 <p>Item(s) Ordered:</p>
//                 <span className="font-medium">
//                   {data?.cart?.length || 0} Items
//                 </span>
//               </div>
//               <div className="flex justify-between items-center pb-2 border-b border-gray-100">
//                 <p>Subtotal:</p>
//                 <span className="font-medium">
//                   {data?.formattedSubtotal || formatCurrency(0, "GHS")}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center pb-2 border-b border-gray-100">
//                 <p>Delivery Fee:</p>
//                 <span className="font-medium">
//                   {data?.formattedDelivery || formatCurrency(0, "GHS")}
//                 </span>
//               </div>
//               {balance !== undefined && (
//                 <div className="flex justify-between items-center pb-2 border-b border-gray-100">
//                   <p
//                     className={`${
//                       balance >= 0 ? "text-emerald-600" : "text-red-600"
//                     } font-semibold`}
//                   >
//                     Your Credit:
//                   </p>
//                   <span
//                     className={`${
//                       balance >= 0 ? "text-emerald-600" : "text-red-600"
//                     } font-semibold`}
//                   >
//                     {formatCurrency(balance, "GHS")}
//                   </span>
//                 </div>
//               )}
//               {deductedBalance > 0 && (
//                 <div className="flex justify-between items-center pb-2 border-b border-gray-100">
//                   <p className="text-green-700 font-semibold">
//                     Credit Applied:
//                   </p>
//                   <span className="text-green-700 font-semibold">
//                     -{formatCurrency(deductedBalance, "GHS")}
//                   </span>
//                 </div>
//               )}
//               {/* Total Row - Visually distinct */}
//               <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
//                 {" "}
//                 {/* Stronger border, increased pt */}
//                 <h3 className="text-lg sm:text-xl font-bold text-gray-800">
//                   Order Total:
//                 </h3>
//                 <span className="font-bold text-lg sm:text-xl text-sowgren_Color">
//                   {formatCurrency(combinedOrderTotal, "GHS")}
//                 </span>
//               </div>
//             </div>
//           </div>
//           {/* Total Due Section */}
//           {deductedBalance > 0 && (
//             <div className="border-t pt-5 mt-5 flex justify-between items-center">
//               {/* Increased pt/mt */}
//               <h3 className="text-lg sm:text-xl font-bold text-red-600">
//                 Amount to Pay:
//               </h3>
//               <p className="font-bold text-lg sm:text-xl text-red-600">
//                 {formatCurrency(updatedOrderTotal, "GHS")}
//               </p>
//             </div>
//           )}
//         </div>
//       </Card>
//     </div>
//   )
// }

// export default InfoCard

export const DeliveryMethod = ({ data }: InfoCardProps) => {
  const deliveryMethod = data?.formData?.deliveryMethod?.trim()?.toUpperCase()

  const deliveryMethodDisplay = useMemo(() => {
    const normalizedDeliveryMethod = deliveryMethod?.trim().toLowerCase()

    if (!deliveryMethod) {
      return (
        <span className="text-gray-500 italic">
          Delivery method not specified.
        </span>
      )
    }

    if (normalizedDeliveryMethod?.includes("home delivery")) {
      return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-2 text-sm sm:text-base">
          <p className="font-semibold">{deliveryMethod}</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-2 text-sm sm:text-base">
        <p className="text-gray-700">PICK UP @</p>
        <p className="font-semibold">{`${deliveryMethod} `}</p>
        <p className="text-xs text-gray-500">on {data?.deliveryDate}</p>
      </div>
    )
  }, [deliveryMethod, data?.deliveryDate])

  return (
    <div>
      <div className="mt-2 text-gray-700">{deliveryMethodDisplay}</div>
    </div>
  )
}
