// "use client"
// import Image from "next/image"
// import ChangeDeliveryMethodDialog from "./DeliveryMethodDialog"
// import CancelCustomerOrderDialog from "./CancelCustomerOrderDialog"
// import EditCustomerOrderDialog from "./EditCustomerOrderDialog"
// import PaystackPayNow from "./PaystackPayNow"

// import { Order, User, UserProps } from "@/types"
// import { useEffect, useState } from "react"
// import { formatCurrency } from "@/lib/utils"
// import { capitalizeName } from "@/lib/capitalizeName"
// import { deductBalance } from "@/lib/actions/deductBalance"
// import { useSession } from "next-auth/react"
// import { getUser } from "@/lib/actions/getUser"

// const OrderDetailPage = ({ params }: { params: { orderNumber: string } }) => {
//   const [orderDetails, setOrderDetails] = useState<Order | null>(null)
//   const [userData, setUserData] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const { data: session } = useSession()
//   const user = session?.user as UserProps
//   const { orderNumber } = params

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!user?.email) return

//       setIsLoading(true) // Start loading

//       const data = await getUser(user.email)
//       if (data) setUserData(data)

//       setIsLoading(false) // Done loading
//     }

//     fetchUser()
//   }, [user?.email])

//   useEffect(() => {
//     async function fetchOrderDetails() {
//       try {
//         const res = await fetch(`/api/order-history/${orderNumber}`, {
//           method: "GET",
//           cache: "no-store",
//         })
//         if (!res.ok) throw new Error(res.statusText)
//         const data = await res.json()
//         setOrderDetails(data)
//       } catch (error) {
//         console.error("Error fetching order details:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchOrderDetails()
//   }, [orderNumber])

//   const orderTotal = orderDetails?.total + orderDetails?.deliveryFee
//   const balance = userData?.user?.balance
//   const { updatedBalance, updatedOrderTotal } = deductBalance(
//     balance,
//     orderTotal
//   )

//   if (isLoading)
//     return (
//       <div className="w-full h-screen flex justify-center items-center">
//         <span className="loading loading-dots loading-lg"></span>
//       </div>
//     )

//   const deliveryMethodNew = orderDetails?.shippingAddress?.deliveryMethod

//   function formatDeliveryMethod(method: string) {
//     const trimmed = method.trim()

//     if (trimmed.toLowerCase().startsWith("home delivery")) {
//       return trimmed
//     }

//     const cleaned = trimmed.replace(/^pickup-?/i, "").trim()
//     return `PICK UP @ ${cleaned}`
//   }

//   const status = orderDetails?.status
//     .split(" ")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//     .join(" ")

//   const name = capitalizeName(orderDetails?.shippingAddress.name)

//   const disablePayNow =
//     orderDetails?.status === "confirmed" && updatedOrderTotal === 0
//   return (
//     <div className="min-h-screen flex flex-col items-center bg-white py-8">
//       <div className="w-full max-w-5xl px-4 space-y-6">
//         <div className="grid grid-cols-5 gap-4 p-4 text-center place-items-center font-bold text-gray-700 border-t border-b border-black ">
//           <h2 className="text-xs md:text-sm lg:text-base">Order #</h2>
//           <h2 className="text-xs md:text-sm lg:text-base">Date Placed</h2>
//           <h2 className="text-xs md:text-sm lg:text-base">Delivery Method</h2>
//           <h2 className="text-xs md:text-sm lg:text-base">Order Total</h2>
//           <h2 className="text-xs md:text-sm lg:text-base">Status</h2>
//         </div>

//         {orderDetails && (
//           <div className="grid grid-cols-5 gap-4 text-center place-items-center text-gray-600 p-4 mb-4 border-b border-gray-200">
//             <p className="text-xs md:text-sm lg:text-base">
//               {orderDetails.orderNumber}
//             </p>
//             <p className="text-xs md:text-sm lg:text-base">
//               {new Date(orderDetails.createdAt).toLocaleDateString()}
//             </p>
//             <p className="text-xs md:text-sm lg:text-base">
//               {/* <span>{orderDetails.shippingAddress.deliveryMethod}</span> */}
//               <span> {formatDeliveryMethod(deliveryMethodNew)}</span>
//               {/* <span>{orderDetails.deliveryDate}</span> */}
//             </p>
//             <p className="text-xs md:text-sm lg:text-base">
//               {formatCurrency(orderTotal, "GHS")}
//             </p>

//             <p className="text-xs md:text-sm">{status}</p>
//           </div>
//         )}

//         <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-4">
//           <div className="border border-neutral-300 rounded-lg p-6 bg-white h-auto">
//             <h2 className="font-bold text-gray-700 mb-3 text-base lg:text-lg">
//               Delivery Address
//             </h2>
//             <div className="flex flex-col gap-1 justify-center">
//               <p className="text-sm lg:text-base text-neutral-600">{name}</p>
//               <p className="text-sm lg:text-base text-neutral-600 max-w-sm">{`${orderDetails?.shippingAddress.address}, ${orderDetails?.shippingAddress.city} - ${orderDetails?.shippingAddress.region}`}</p>

//               <p className="text-sm lg:text-base text-neutral-600">
//                 {orderDetails?.shippingAddress.email}
//               </p>
//               <p className="text-sm lg:text-base text-neutral-600">
//                 {orderDetails?.shippingAddress.phone}
//               </p>
//             </div>
//           </div>

//           <div className="border border-neutral-300 rounded-lg p-6 bg-white h-auto">
//             <h2 className="font-bold text-gray-700 mb-3 text-base lg:text-lg">
//               Order Details
//             </h2>
//             <div className="flex flex-col">
//               <div className="flex justify-between">
//                 <p className="font-medium text-sm lg:text-base">Subtotal</p>
//                 <p className="text-sm text-neutral-600 lg:text-base">{`GHS ${orderDetails?.total.toFixed(
//                   2
//                 )}`}</p>
//               </div>
//               <div className="flex justify-between">
//                 <p className="font-medium text-sm lg:text-base">Delivery Fee</p>
//                 <p className="text-sm text-neutral-600 lg:text-base">{`GHS ${orderDetails?.deliveryFee.toFixed(
//                   2
//                 )}`}</p>
//               </div>
//               <div className="flex justify-between">
//                 <p className="font-medium text-sm lg:text-base">Credit Bal.</p>
//                 <p className="text-sm text-neutral-600 lg:text-base">
//                   {formatCurrency(orderDetails?.creditAppliedTotal, "GHS")}
//                 </p>
//               </div>
//               <div className="flex flex-col justify-between">
//                 <div className="flex w-full justify-between">
//                   <p className="font-medium text-sm lg:text-base">Total</p>
//                   <p className="text-sm text-neutral-600 lg:text-base">
//                     {formatCurrency(orderTotal, "GHS")}
//                   </p>
//                 </div>
//                 <div className="flex w-full justify-between">
//                   <p className="text-sm lg:text-base text-red-500 font-semibold">
//                     Total Due
//                   </p>
//                   <p className="text-xs md:text-sm lg:text-base font-semibold text-red-500">
//                     {formatCurrency(orderDetails?.updatedOrderTotal, "GHS")}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4 mt-8 w-full">
//           <div className="flex">
//             <h2 className="font-bold text-lg hidden sm:inline-flex w-1/4 ">
//               Products
//             </h2>
//             <div className="w-full flex ">
//               <div className="w-full flex flex-col gap-y-3 sm:grid sm:grid-cols-2 sm:gap-x-3">
//                 <div className="flex gap-x-3 w-full">
//                   <PaystackPayNow
//                     order={orderDetails}
//                     updatedBalance={updatedBalance}
//                     disablePayNow={disablePayNow}
//                   />
//                   <EditCustomerOrderDialog order={orderDetails} className="" />
//                   <CancelCustomerOrderDialog order={orderDetails} />
//                 </div>
//                 <div className="">
//                   <ChangeDeliveryMethodDialog order={orderDetails} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-4 overflow-auto scrollbar-thin max-h-96 border border-slate-300 rounded-lg">
//             {orderDetails?.products?.map((product, index) => {
//               return (
//                 <div
//                   key={index}
//                   className={`flex justify-between items-center p-4 border-b border-gray-200 ${
//                     product?.available === false && "opacity-50"
//                   }`}
//                 >
//                   <div className="flex items-center space-x-4">
//                     <Image
//                       src={
//                         product?.product?.images[0]?.url ||
//                         product?.product?.imageUrl
//                       }
//                       alt={product.product.title}
//                       className={`h-20 w-20 object-contain rounded-md bg-slate-100/85 p-0.5 ${
//                         product?.available === false && "grayscale"
//                       }`}
//                       width={90}
//                       height={90}
//                     />
//                     <div className="flex flex-col space-y-1 max-w-xs">
//                       <p className="text-sm md:text-base line-clamp-1">
//                         <span
//                           className={`font-semibold text-gray-800 text-base ${
//                             product?.available === false && "text-gray-500"
//                           }`}
//                         >
//                           {product?.product?.title}
//                         </span>
//                         {product?.available === false && <span> - N/A</span>}
//                       </p>
//                       <p className="font-medium text-gray-600/65 text-sm">
//                         {formatCurrency(product?.price, "GHS")}
//                         {product?.weight === null ? (
//                           ""
//                         ) : (
//                           <span className="text-sm text-neutral-400">
//                             {` / ${
//                               product?.weight < 1
//                                 ? product?.weight * 1000
//                                 : product?.weight
//                             }${product?.unit}`}
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="text-right space-y-1">
//                     <div className="text-sm text-neutral-600 space-x-2 flex flex-col">
//                       <span className="font-semibold">{`QTY : ${product?.quantity}`}</span>
//                       <span>{`Subtotal:  ${formatCurrency(
//                         parseFloat(product?.quantityTotal),
//                         "GHS"
//                       )}`}</span>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//           <div className="flex flex-col gap-y-0.5 border border-slate-300 rounded-lg p-2">
//             <div className="flex justify-between">
//               <p className="text-neutral-500 text-sm lg:text-base">Subtotal</p>
//               <p className="font-medium text-sm lg:text-base">
//                 {formatCurrency(orderDetails?.total, "GHS")}
//               </p>
//             </div>
//             <div className="flex justify-between">
//               <p className="text-neutral-500 text-sm lg:text-base">
//                 Delivery Fee
//               </p>
//               <p className="font-medium text-sm lg:text-base">
//                 {formatCurrency(orderDetails?.deliveryFee, "GHS")}
//               </p>
//             </div>
//             <div className="flex justify-between">
//               <p
//                 className={`text-sm lg:text-base font-semibold ${
//                   orderDetails?.creditAppliedTotal >= 0
//                     ? "text-emerald-500"
//                     : "text-red-500"
//                 }`}
//               >
//                 Credit Bal.
//               </p>
//               <p
//                 className={`text-xs md:text-sm lg:text-base font-semibold ${
//                   orderDetails?.creditAppliedTotal >= 0
//                     ? "text-emerald-500"
//                     : "text-red-500"
//                 }`}
//               >
//                 {formatCurrency(orderDetails?.creditAppliedTotal, "GHS")}
//               </p>
//             </div>

//             <div className="flex justify-between">
//               <p className="text-neutral-500 text-sm lg:text-base">Total</p>
//               <p className="font-medium text-sm lg:text-base">
//                 {formatCurrency(orderTotal, "GHS")}
//               </p>
//             </div>

//             <div className="flex justify-between">
//               <p className="text-sm lg:text-base text-red-500 font-semibold">
//                 Total Due
//               </p>
//               <p className="text-xs md:text-sm lg:text-base text-red-500 font-semibold">
//                 {formatCurrency(orderDetails?.updatedOrderTotal, "GHS")}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default OrderDetailPage

"use client"
import Image from "next/image"
import ChangeDeliveryMethodDialog from "./DeliveryMethodDialog"
import CancelCustomerOrderDialog from "./CancelCustomerOrderDialog"
import EditCustomerOrderDialog from "./EditCustomerOrderDialog"
import PaystackPayNow from "./PaystackPayNow"

import { Order, User, UserProps } from "@/types"
import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { capitalizeName } from "@/lib/capitalizeName"
import { deductBalance } from "@/lib/actions/deductBalance"
import { useSession } from "next-auth/react"
import { getUser } from "@/lib/actions/getUser"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const OrderDetailPage = ({ params }: { params: { orderNumber: string } }) => {
  const [orderDetails, setOrderDetails] = useState<Order | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const user = session?.user as UserProps
  const { orderNumber } = params

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.email) return

      setIsLoading(true)
      const data = await getUser(user.email)
      if (data) setUserData(data)
      setIsLoading(false)
    }

    fetchUser()
  }, [user?.email])

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const res = await fetch(`/api/order-history/${orderNumber}`, {
          method: "GET",
          cache: "no-store",
        })
        if (!res.ok) throw new Error(res.statusText)
        const data = await res.json()
        setOrderDetails(data)
      } catch (error) {
        console.error("Error fetching order details:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrderDetails()
  }, [orderNumber])

  const orderTotal = orderDetails?.total + orderDetails?.deliveryFee
  const balance = userData?.user?.balance
  const { updatedBalance, updatedOrderTotal } = deductBalance(
    balance,
    orderTotal
  )

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="space-y-4 w-full max-w-5xl px-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  const deliveryMethodNew = orderDetails?.shippingAddress?.deliveryMethod

  function formatDeliveryMethod(method: string) {
    const trimmed = method?.trim()
    if (trimmed?.toLowerCase().startsWith("home delivery")) {
      return trimmed
    }
    const cleaned = trimmed?.replace(/^pickup-?/i, "").trim()
    return `PICK UP @ ${cleaned}`
  }

  const status = orderDetails?.status
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")

  const name = capitalizeName(orderDetails?.shippingAddress.name)

  const disablePayNow =
    orderDetails?.status === "confirmed" && updatedOrderTotal === 0

  const getStatusBadgeVariant = () => {
    switch (orderDetails?.status.toLowerCase()) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "delivered":
        return "success"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Order Summary Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order #{orderDetails?.orderNumber}
            </h1>
            <p className="text-gray-500 text-sm">
              Placed on{" "}
              {new Date(orderDetails?.createdAt).toLocaleDateString("en-GH", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge variant={getStatusBadgeVariant()} className="mt-1">
                {status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Delivery Method
              </p>
              <p className="text-sm text-gray-900 mt-1">
                {formatDeliveryMethod(deliveryMethodNew)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Order Total</p>
              <p className="text-sm text-gray-900 mt-1">
                {formatCurrency(orderTotal, "GHS")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment</p>
              <p className="text-sm text-gray-900 mt-1 capitalize">
                {orderDetails?.paymentAction === "paid" ? (
                  <span className="text-emerald-600">
                    Paid ({orderDetails?.paymentMode})
                  </span>
                ) : (
                  <span className="text-amber-600">Pending</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Delivery Address Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="text-sm text-gray-600">
                  {orderDetails?.shippingAddress.address},<br />
                  {orderDetails?.shippingAddress.city} -{" "}
                  {orderDetails?.shippingAddress.region}
                </p>
                <p className="text-sm text-gray-600">
                  {orderDetails?.shippingAddress.phone}
                </p>
                <p className="text-sm text-gray-600">
                  {orderDetails?.shippingAddress.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(orderDetails?.total, "GHS")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Delivery Fee</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(orderDetails?.deliveryFee, "GHS")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Credit Balance</span>
                  <span
                    className={`text-sm font-medium ${
                      orderDetails?.creditAppliedTotal >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(orderDetails?.creditAppliedTotal, "GHS")}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    Total
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(orderTotal, "GHS")}
                  </span>
                </div>
                <div className="flex justify-between rounded-md">
                  <span className="text-sm font-semibold text-red-600">
                    Total Due
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatCurrency(orderDetails?.updatedOrderTotal, "GHS")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm px-4 py-4 sm:px-6 sm:py-4">
          {" "}
          {/* Increased vertical padding */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {" "}
            {/* Changed items-start to items-center */}
            <h2 className="text-lg font-semibold text-gray-900">
              Order Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto">
              <PaystackPayNow
                order={orderDetails}
                updatedBalance={updatedBalance}
                disablePayNow={disablePayNow}
              />
              <EditCustomerOrderDialog order={orderDetails} />
              <CancelCustomerOrderDialog order={orderDetails} />
              <ChangeDeliveryMethodDialog order={orderDetails} />
            </div>
          </div>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto pr-2 -mr-2 custom-scrollbar">
              <div className="space-y-4">
                {orderDetails?.products?.map((product, index) => (
                  <div
                    key={index}
                    className={`flex flex-col sm:flex-row justify-between p-4 border border-gray-200 rounded-lg ${
                      product?.available === false && "opacity-70 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <Image
                          src={
                            product?.product?.images[0]?.url ||
                            product?.product?.imageUrl
                          }
                          alt={product.product.title}
                          className={`object-contain rounded-md bg-gray-100 p-1 ${
                            product?.available === false && "grayscale"
                          }`}
                          fill
                        />
                      </div>
                      <div>
                        <h3
                          className={`text-sm font-medium ${
                            product?.available === false
                              ? "text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {product?.product?.title}
                          {product?.available === false && " - Not Available"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatCurrency(product?.price, "GHS")}
                          {product?.weight && (
                            <span className="text-xs text-gray-400 ml-1">
                              {` / ${
                                product?.weight < 1
                                  ? product?.weight * 1000
                                  : product?.weight
                              }${product?.unit}`}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {/* Modified quantity section for mobile */}
                    <div className="mt-4 sm:mt-0">
                      <div className="flex justify-between sm:block">
                        <p className="text-sm text-gray-900 sm:mb-1">
                          Qty: {product?.quantity}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(
                            parseFloat(product?.quantityTotal),
                            "GHS"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total Summary */}
            <div className="mt-6 border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium">
                  {formatCurrency(orderDetails?.total, "GHS")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Delivery Fee</span>
                <span className="text-sm font-medium">
                  {formatCurrency(orderDetails?.deliveryFee, "GHS")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Credit Balance</span>
                <span
                  className={`text-sm font-medium ${
                    orderDetails?.creditAppliedTotal >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(orderDetails?.creditAppliedTotal, "GHS")}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {formatCurrency(orderTotal, "GHS")}
                </span>
              </div>
              <div className="flex justify-between rounded-md">
                <span className="text-base font-semibold text-red-600">
                  Total Due
                </span>
                <span className="text-base font-semibold text-red-600">
                  {formatCurrency(orderDetails?.updatedOrderTotal, "GHS")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OrderDetailPage
