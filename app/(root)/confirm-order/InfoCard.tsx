// import { Separator } from "@/components/ui/separator"
// import React, { useMemo } from "react"
// import Card from "./Card"
// import { date, formatCurrency } from "@/lib/utils"
// import { useDeliveryStore } from "@/store"

// interface InfoCardProps {
//   data: any
// }

// const InfoCard = ({ data }: InfoCardProps) => {
//   const deliveryMethod = data?.formData?.deliveryMethod?.trim()?.toUpperCase()
//   const deliveryFee = useDeliveryStore((state) => state.deliveryFee)

//   const deliveryMethodLabel = useMemo(() => {
//     switch (deliveryMethod) {
//       case "DZORWULU":
//         return "Pick Up - DZORWULU"
//       case "WEB DuBOIS CENTER":
//         return `Pick Up - WEB DuBOIS CENTER`
//       case `Home Delivery - ${deliveryMethod}`:
//         return `Home Delivery - ${deliveryMethod}`
//       default:
//         console.warn("Unexpected delivery method:", deliveryMethod) // Debugging line
//         return deliveryMethod || "Not specified"
//     }
//   }, [deliveryMethod])

//   return (
//     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
//       <Card>
//         <div className="flex flex-col gap-2 lg:gap-4">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-700">
//               Delivery Address
//             </h3>
//             <div className="flex flex-col items-end md:items-start">
//               <p className="text-gray-600">
//                 {data?.formData?.name || "No name"}
//               </p>
//               <p className="text-gray-600">
//                 {data?.formData?.address || "No address"}
//               </p>
//               <p className="text-gray-600">
//                 {data?.formData?.city || "No city"}
//               </p>
//               <p className="text-gray-600">
//                 {data?.formData?.region || "No region"}
//               </p>
//               <p className="text-gray-600">
//                 {data?.formData?.phone || "No phone"}
//               </p>
//               <p className="text-gray-600">
//                 {data?.formData?.email || "No email"}
//               </p>
//             </div>
//           </div>
//           <Separator className="my-2" />
//           <div className="w-full">
//             <h3 className="text-lg font-semibold text-gray-700">
//               Delivery Method
//             </h3>
//             <p className="text-gray-600 flex justify-end md:justify-start">
//               {deliveryMethodLabel}
//             </p>
//           </div>
//         </div>
//       </Card>
//       <Card>
//         <div className="flex flex-col gap-2 lg:gap-4">
//           <div className="">
//             <h3 className="text-lg font-semibold text-gray-700">
//               Order Summary
//             </h3>
//             <div className="flex flex-col gap-3.5 mt-2 items-start w-full">
//               <div className="flex items-center justify-between w-full">
//                 <p className="text-gray-600 font-medium">Order Created:</p>
//                 <span className="font-medium">{date}</span>
//               </div>

//               <div className="flex items-center justify-between w-full">
//                 <p className="text-gray-600 font-medium">Item(s) Ordered:</p>
//                 <span className="font-medium">
//                   {data?.cart?.length || 0} Items
//                 </span>
//               </div>
//               <div className="flex items-center justify-between w-full">
//                 <p className="text-gray-600 font-medium">Delivery Fee:</p>
//                 <span className="font-medium">
//                   {data?.formattedDelivery || "No delivery fee"}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between w-full">
//                 <p className="text-gray-600 font-medium">Subtotal:</p>
//                 <span className="font-medium">
//                   {data?.formattedSubtotal || "No subtotal"}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <Separator className="my-2" />
//           <div className="w-full flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-700">Order Total</h3>
//             <p className="text-gray-600 flex justify-end md:justify-start">
//               {formatCurrency(data?.total + deliveryFee, "GHS") || "No total"}
//             </p>
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }

// export default InfoCard

import { Separator } from "@/components/ui/separator"
import React, { useMemo } from "react"
import Card from "./Card"
import { date, formatCurrency } from "@/lib/utils"
import { useDeliveryStore } from "@/store"
import { FaMapMarkerAlt, FaTruck, FaClipboardList } from "react-icons/fa"

interface InfoCardProps {
  data: any
}

const InfoCard = ({ data }: InfoCardProps) => {
  const deliveryMethod = data?.formData?.deliveryMethod?.trim()?.toUpperCase()
  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)

  const deliveryMethodLabel = useMemo(() => {
    switch (deliveryMethod) {
      case "DZORWULU":
        return "Pick Up - DZORWULU"
      case "WEB DuBOIS CENTER":
        return `Pick Up - WEB DuBOIS CENTER`
      case `Home Delivery - ${deliveryMethod}`:
        return `Home Delivery - ${deliveryMethod}`
      default:
        return deliveryMethod || "Not specified"
    }
  }, [deliveryMethod])

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              Delivery Address
            </h3>
            <div className="mt-2 space-y-1 text-gray-600">
              <p>{data?.formData?.name || "No name"}</p>
              <p>
                {data?.formData?.address || "No address"},{" "}
                {data?.formData?.city || "No city"}
              </p>
              <p>{data?.formData?.region || "No region"}</p>
              <p>{data?.formData?.phone || "No phone"}</p>
              <p>{data?.formData?.email || "No email"}</p>
            </div>
          </div>
          <Separator className="" />
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaTruck className="text-green-500" />
              Delivery Method
            </h3>
            <p className="mt-2 text-gray-600">
              <span className="bg-cyan-500/25 text-cyan-500 px-2 py-1 rounded-full text-sm">
                {deliveryMethodLabel}
              </span>
            </p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaClipboardList className="text-purple-500" />
              Order Summary
            </h3>
            <div className="mt-2 space-y-2 text-gray-600">
              <div className="flex justify-between">
                <p>Order Created:</p>
                <span className="font-medium">{date}</span>
              </div>
              <div className="flex justify-between">
                <p>Item(s) Ordered:</p>
                <span className="font-medium">
                  {data?.cart?.length || 0} Items
                </span>
              </div>
              <div className="flex justify-between">
                <p>Delivery Fee:</p>
                <span className="font-medium">
                  {data?.formattedDelivery || "No delivery fee"}
                </span>
              </div>
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <span className="font-medium">
                  {data?.formattedSubtotal || "No subtotal"}
                </span>
              </div>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between">
            <h3 className="text-xl font-bold text-gray-800">Order Total</h3>
            <p className="text-gray-600 font-bold">
              {formatCurrency(data?.total + deliveryFee, "GHS") || "No total"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default InfoCard
