// "use client"

// import Image from "next/image"
// import OrderConfirmSkeleton from "@/components/skeletons/OrderConfirmSkeleton"
// import { Separator } from "@/components/ui/separator"
// import { useDeliveryStore, useOrderDataStore } from "@/store"
// import { useEffect, useMemo, useState } from "react"
// import { OrderInfo } from "./OrderInfo"
// import { ShippingAddress } from "./ShippingAddress"
// import { formatCurrency } from "@/lib/utils"
// import { Product } from "@/types"
// import { CircleCheckBigIcon } from "lucide-react"

// const ThankYouPage = () => {
//   const [newProduct, setNewProduct] = useState<Product[]>([])

//   // Fetch state data
//   const ordersData = useOrderDataStore((state) => state.ordersData)
//   const { deliveryFee } = useDeliveryStore()

//   // Extract order details
//   const {
//     orderNumber,
//     shippingAddress,
//     products,
//     total,
//     deliveryDate,
//     deliveryMethod,
//   } = ordersData || {}

//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const res = await fetch("/api/products", {
//           method: "GET",
//           cache: "no-store",
//         })

//         if (res.ok) {
//           const cartProducts = await res.json()
//           setNewProduct(cartProducts)
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error)
//       }
//     }

//     fetchProducts()
//   }, [])

//   const productMap = Object.fromEntries(
//     newProduct.map((product) => [product.id, product])
//   )

//   const deliveryMethodLabel = useMemo(() => {
//     if (!shippingAddress.deliveryMethod) {
//       return "Not specified"
//     }

//     if (shippingAddress.deliveryMethod !== "Home Delivery") {
//       return `PICK UP - ${shippingAddress.deliveryMethod} - ${deliveryDate}`
//     }

//     return `Home Delivery - ${deliveryDate}`
//   }, [shippingAddress.deliveryMethod, deliveryDate])

//   const enrichedProducts =
//     products?.map((product) => ({
//       ...product,
//       item: {
//         ...product.item,
//         product: productMap[product.item.productId] || null,
//       },
//     })) || []

//   // Format delivery fee
//   const formattedDelivery = formatCurrency(deliveryFee || 0, "GHS")

//   // Show skeleton if no data
//   if (!ordersData) {
//     return <OrderConfirmSkeleton />
//   }

//   return (
//     <div className="flex flex-col items-center w-full p-12 bg-gray-100 min-h-screen">
//       <div className="flex flex-col items-center gap-y-2 mb-3">
//         <p className="font-semibold text-sm text-neutral-500/95">THANK YOU</p>
//         <div className="flex items-center w-full space-x-2">
//           <CircleCheckBigIcon className="h-6 w-6 text-green-700 " />
//           <h3 className="md:text-2xl text-xl font-bold">
//             Your Order Has Been Received
//           </h3>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[950px] w-full">
//         {/* Left Section: Order Info */}
//         <div className="w-full bg-white rounded-lg p-4">
//           <OrderInfo orderNumber={orderNumber} />
//           <Separator className="mt-6 mb-4" />
//           <ShippingAddress shippingAddress={shippingAddress} />
//           <Separator className="mt-6 mb-4" />
//           <div className="flex flex-col">
//             <h2 className="text-sm font-bold mb-3">Shipping Method</h2>
//             <p className="text-sm font-medium text-neutral-500/80 mb-2">
//               {/* {shippingAddress.deliveryMethod === "Home Delivery"
//                 ? `${shippingAddress.deliveryMethod} - ${deliveryDate}`
//                 : `${shippingAddress.deliveryMethod} - ${deliveryDate}`} */}
//               {deliveryMethodLabel}
//             </p>
//           </div>
//         </div>

//         {/* Right Section: Products and Totals */}
//         <div className="w-full flex flex-col justify-between bg-white rounded-lg  p-4">
//           <div className="flex flex-col gap-2 flex-grow">
//             <h2 className="text-sm font-bold mb-2">Ordered Items</h2>
//             <div className="flex flex-col gap-3 max-h-[290px] overflow-y-auto scrollbar-hide p-2">
//               {enrichedProducts.length ? (
//                 enrichedProducts.map((order) => (
//                   <div
//                     key={order?.item?.productId}
//                     className="flex items-start justify-between w-full"
//                   >
//                     <div className="flex gap-4 w-full">
//                       <div className="bg-gray-100 p-1.5 rounded-lg">
//                         <Image
//                           src={
//                             order?.item?.product?.imageUrl ||
//                             order?.item?.product?.images[0]?.url
//                           }
//                           alt={order?.item?.product?.title}
//                           height={50}
//                           width={50}
//                           className="h-14 w-14 object-contain"
//                           priority
//                         />
//                       </div>
//                       <div>
//                         <p className="text-sm font-semibold line-clamp-1">
//                           {order?.item?.product?.title}
//                         </p>

//                         <p className="font-medium text-gray-600/65 text-sm">
//                           {formatCurrency(order?.item?.price, "GHS")}
//                           {order?.item?.weight === null ? (
//                             ""
//                           ) : (
//                             <span className="text-sm text-neutral-400">
//                               {` / ${
//                                 order?.item?.weight < 1
//                                   ? order?.item?.weight * 1000
//                                   : order?.item?.weight
//                               }${order?.item?.unit}`}
//                             </span>
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-right space-y-1 w-fit">
//                       <div className="text-sm text-neutral-600 space-x-2 flex flex-col">
//                         <span className="">{`QTY : ${order?.item?.quantity}`}</span>
//                         <span className="">{`Subtotal:  ${formatCurrency(
//                           parseFloat(order?.total),
//                           "GHS"
//                         )}`}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-neutral-500">
//                   No products available.
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="flex flex-col gap-y-2 mt-3">
//             <Separator />
//             <div className="flex flex-col gap-1">
//               <div className="flex justify-between">
//                 <p className="text-sm font-medium text-neutral-500/85">
//                   Subtotal
//                 </p>
//                 <p className="text-sm font-semibold text-neutral-500/85">
//                   {formatCurrency(total || 0, "GHS")}
//                 </p>
//               </div>
//               <div className="flex justify-between">
//                 <p className="text-sm font-medium text-neutral-500/85">
//                   Delivery Fee
//                 </p>
//                 <p className="text-sm font-semibold text-neutral-500/85">
//                   {formattedDelivery}
//                 </p>
//               </div>
//               <div className="flex justify-between">
//                 <p className="text-sm font-bold text-black">Total</p>
//                 <p className="text-sm font-bold">
//                   {formatCurrency((total || 0) + (deliveryFee || 0), "GHS")}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ThankYouPage

"use client"

import Image from "next/image"
import OrderConfirmSkeleton from "@/components/skeletons/OrderConfirmSkeleton"
import { Separator } from "@/components/ui/separator"
import { useDeliveryStore, useOrderDataStore } from "@/store"
import { useEffect, useMemo, useState } from "react"
import { OrderInfo } from "./OrderInfo"
import { ShippingAddress } from "./ShippingAddress"
import { formatCurrency } from "@/lib/utils"
import { Product } from "@/types"
import { CircleCheckBigIcon } from "lucide-react"

const ThankYouPage = () => {
  const [newProduct, setNewProduct] = useState<Product[]>([])

  // Fetch state data
  const ordersData = useOrderDataStore((state) => state.ordersData)
  const { deliveryFee } = useDeliveryStore()

  // Extract order details
  const {
    orderNumber,
    shippingAddress,
    products,
    total,
    deliveryDate,
    deliveryMethod,
  } = ordersData || {}

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const cartProducts = await res.json()
          setNewProduct(cartProducts)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [])

  const productMap = Object.fromEntries(
    newProduct.map((product) => [product.id, product])
  )

  const deliveryMethodLabel = useMemo(() => {
    if (!shippingAddress?.deliveryMethod) {
      return "Not specified"
    }

    // Debugging: Log the delivery method
    console.log("Delivery Method:", shippingAddress.deliveryMethod)

    // Normalize the delivery method (trim whitespace and convert to lowercase)
    const normalizedDeliveryMethod = shippingAddress.deliveryMethod
      .trim()
      .toLowerCase()

    if (normalizedDeliveryMethod === "home delivery") {
      return `Home Delivery - ${deliveryDate}`
    }

    return `PICK UP - ${shippingAddress.deliveryMethod} - ${deliveryDate}`
  }, [shippingAddress?.deliveryMethod, deliveryDate])
  const enrichedProducts =
    products?.map((product) => ({
      ...product,
      item: {
        ...product.item,
        product: productMap[product.item.productId] || null,
      },
    })) || []

  // Format delivery fee
  const formattedDelivery = formatCurrency(deliveryFee || 0, "GHS")

  // Show skeleton if no data
  if (!ordersData) {
    return <OrderConfirmSkeleton />
  }

  return (
    <div className="flex flex-col items-center w-full p-12 bg-gray-100 min-h-screen">
      <div className="flex flex-col items-center gap-y-2 mb-3">
        <p className="font-semibold text-sm text-neutral-500/95">THANK YOU</p>
        <div className="flex items-center w-full space-x-2">
          <CircleCheckBigIcon className="h-6 w-6 text-green-700 " />
          <h3 className="md:text-2xl text-xl font-bold">
            Your Order Has Been Received
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[950px] w-full">
        {/* Left Section: Order Info */}
        <div className="w-full bg-white rounded-lg p-4">
          <OrderInfo orderNumber={orderNumber} />
          <Separator className="mt-6 mb-4" />
          <ShippingAddress shippingAddress={shippingAddress} />
          <Separator className="mt-6 mb-4" />
          <div className="flex flex-col">
            <h2 className="text-sm font-bold mb-3">Shipping Method</h2>
            <p className="text-sm font-medium text-neutral-500/80 mb-2">
              {deliveryMethodLabel}
            </p>
          </div>
        </div>

        {/* Right Section: Products and Totals */}
        <div className="w-full flex flex-col justify-between bg-white rounded-lg p-4">
          <div className="flex flex-col gap-2 flex-grow">
            <h2 className="text-sm font-bold mb-2">Ordered Items</h2>
            <div className="flex flex-col gap-3 max-h-[245px] overflow-y-auto scrollbar-thin p-2">
              {enrichedProducts.length ? (
                enrichedProducts.map((order) => (
                  <div
                    key={order?.item?.productId}
                    className="flex items-start justify-between w-full"
                  >
                    <div className="flex gap-4 w-full">
                      <div className="bg-gray-100 p-1.5 rounded-lg">
                        <Image
                          src={
                            order?.item?.product?.imageUrl ||
                            order?.item?.product?.images[0]?.url
                          }
                          alt={order?.item?.product?.title}
                          height={50}
                          width={50}
                          className="h-14 w-14 object-contain"
                          priority
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold line-clamp-1">
                          {order?.item?.product?.title}
                        </p>

                        <p className="font-medium text-gray-600/65 text-sm">
                          {formatCurrency(order?.item?.price, "GHS")}
                          {order?.item?.weight === null ? (
                            ""
                          ) : (
                            <span className="text-sm text-neutral-400">
                              {` / ${
                                order?.item?.weight < 1
                                  ? order?.item?.weight * 1000
                                  : order?.item?.weight
                              }${order?.item?.unit}`}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1 w-fit">
                      <div className="text-sm text-neutral-600 space-x-2 flex flex-col">
                        <span className="">{`QTY : ${order?.item?.quantity}`}</span>
                        <span className="">{`Subtotal:  ${formatCurrency(
                          parseFloat(order?.total),
                          "GHS"
                        )}`}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500">
                  No products available.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-y-2 mt-3">
            <Separator />
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-neutral-500/85">
                  Subtotal
                </p>
                <p className="text-sm font-semibold text-neutral-500/85">
                  {formatCurrency(total || 0, "GHS")}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-medium text-neutral-500/85">
                  Delivery Fee
                </p>
                <p className="text-sm font-semibold text-neutral-500/85">
                  {formattedDelivery}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-bold text-black">Total</p>
                <p className="text-sm font-bold">
                  {formatCurrency((total || 0) + (deliveryFee || 0), "GHS")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThankYouPage
