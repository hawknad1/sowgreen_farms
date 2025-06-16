// "use client"

// import React, { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Order, ProductOrder } from "@/types"
// import Image from "next/image"
// import { toast } from "react-hot-toast"
// import { TrashIcon } from "@heroicons/react/24/solid"
// import { formatCurrency } from "@/lib/utils"
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { deductBalance } from "@/lib/actions/deductBalance"
// import { useSession } from "next-auth/react"

// interface EditOrderProps {
//   orders: Order
//   setOrderItems: React.Dispatch<React.SetStateAction<ProductOrder[]>>
//   customer?: boolean
// }

// const EditCustomerOrder = ({
//   orders,
//   setOrderItems,
//   customer,
// }: EditOrderProps) => {
//   const [orderDetails, setOrderDetails] = useState(orders) // Local state for orders
//   const [activeUser, setActiveUser] = useState(null)
//   const [subtotal, setSubtotal] = useState(0)
//   const [total, setTotal] = useState(0)
//   const [deliveryFee, setDeliveryFee] = useState(orderDetails.deliveryFee)
//   const [updatedOrderTotal, setUpdatedOrderTotal] = useState(0)
//   const [isSaving, setIsSaving] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const { data: session } = useSession()
//   // const user = session?.user
//   const customerEmail = orderDetails?.shippingAddress?.email

//   const balance = activeUser?.user?.balance
//   const checkTotal = orderDetails?.paymentAction !== "paid" && balance > 0

//   console.log(balance, "user-balance")
//   console.log(orderDetails?.shippingAddress?.email, "user")

//   useEffect(() => {
//     const getUser = async () => {
//       if (!customerEmail) return
//       setIsLoading(true)
//       try {
//         const res = await fetch(`/api/user/${customerEmail}`, {
//           method: "GET",
//           cache: "no-store",
//         })
//         if (res.ok) {
//           const active = await res.json()
//           setActiveUser(active)
//         } else {
//           console.error("Failed to fetch user details:", res.statusText)
//         }
//       } catch (error) {
//         console.error("Failed to fetch user details:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     getUser()
//   }, [customerEmail])

//   useEffect(() => {
//     if (isLoading) return // Don't calculate if still loading

//     const newSubtotal = orderDetails.products.reduce((sum, item) => {
//       // Only add to subtotal if product is available and in stock
//       if (item.available && item?.product?.isInStock !== "out-of-stock") {
//         return sum + item.price * item.quantity
//       }
//       return sum
//     }, 0)
//     const newTotal = newSubtotal + orderDetails.deliveryFee
//     setSubtotal(parseFloat(newSubtotal.toFixed(2)))

//     // Recalculate the updatedOrderTotal whenever orderDetails change
//     const { updatedOrderTotal: newUpdatedOrderTotal } = deductBalance(
//       balance,
//       newTotal
//     )

//     setUpdatedOrderTotal(newUpdatedOrderTotal)
//     setTotal(checkTotal ? Math.max(0, newTotal - balance) : newTotal)
//   }, [orderDetails.products, orderDetails.deliveryFee, balance, checkTotal])

//   const handleQuantityChange = (productId: string, quantity: number) => {
//     setOrderDetails((prev) => ({
//       ...prev,
//       products: prev.products.map((item) =>
//         item.productId === productId ? { ...item, quantity } : item
//       ),
//     }))
//     setOrderItems((prev) =>
//       prev.map((item) =>
//         item.productId === productId ? { ...item, quantity } : item
//       )
//     )
//   }

//   const handleRemoveItem = (productOrderId: string) => {
//     setOrderDetails((prev) => ({
//       ...prev,
//       products: prev.products.filter((item) => item.id !== productOrderId),
//     }))
//     setOrderItems((prev) => prev.filter((item) => item.id !== productOrderId))
//   }

//   const handleSaveChanges = async () => {
//     setIsSaving(true)
//     try {
//       const response = await fetch(`/api/orders/${orderDetails.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           products: orderDetails.products,
//           total: subtotal,
//           deliveryFee: deliveryFee,
//           updatedOrderTotal,
//         }),
//       })

//       if (response.ok) {
//         toast.success("Order updated successfully!")
//         window.location.reload()
//       } else {
//         const { message } = await response.json()
//         toast.error(`Failed to update order: ${message}`)
//       }
//     } catch (error) {
//       toast.error("An error occurred while updating the order!")
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   return (
//     <div className="flex flex-col justify-between max-h-[400px]">
//       <div className="h-[300px] overflow-y-scroll scrollbar-thin">
//         {[...orderDetails.products].reverse().map((item) => {
//           const outOfStock = item?.product?.isInStock === "out-of-stock"

//           return (
//             <div
//               key={item.id}
//               className="flex items-center justify-between border-b py-2"
//             >
//               <div className="flex gap-x-3 items-center">
//                 <Image
//                   src={item?.product?.imageUrl || item?.product?.images[0]?.url}
//                   alt={item?.product?.title}
//                   height={40}
//                   width={40}
//                   className="object-contain h-10 w-10 md:h-16 md:w-16 bg-gray-100 p-1 rounded-md"
//                 />
//                 <div>
//                   <p className={` `}>
//                     <span
//                       className={`font-semibold max-w-[120px] md:max-w-none line-clamp-1 md:line-clamp-none w-36 md:w-full text-xs md:text-base text-black ${
//                         !item?.available ||
//                         (outOfStock && "line-through text-red-500")
//                       }`}
//                     >
//                       {" "}
//                       {item?.product?.title}
//                     </span>
//                     {!item?.available || (outOfStock && <span> - N/A</span>)}
//                   </p>
//                   <p className="text-xs md:text-sm">
//                     {formatCurrency(item?.price, "GHS")}{" "}
//                     {item?.weight === 0 || item?.weight === null ? (
//                       ""
//                     ) : (
//                       <span className="text-xs md:text-sm text-neutral-400">{`/ ${
//                         item?.weight < 1 ? item?.weight * 1000 : item?.weight
//                       }${item?.unit}`}</span>
//                     )}{" "}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 {!customer && (
//                   <Select
//                     onValueChange={(value) => {
//                       const isAvailable = value === "instock"
//                       setOrderDetails((prev) => ({
//                         ...prev,
//                         products: prev.products.map((prod) =>
//                           prod.productId === item.productId
//                             ? { ...prod, available: isAvailable }
//                             : prod
//                         ),
//                       }))
//                       setOrderItems((prev) =>
//                         prev.map((prod) =>
//                           prod.productId === item.productId
//                             ? { ...prod, available: isAvailable }
//                             : prod
//                         )
//                       )
//                     }}
//                     defaultValue={
//                       item?.product?.isInStock === "out-of-stock"
//                         ? "outofstock"
//                         : item.available
//                         ? "instock"
//                         : "outofstock"
//                     }
//                   >
//                     <SelectTrigger className="w-[120px]">
//                       <SelectValue
//                         placeholder={item.available ? "Instock" : "Outofstock"}
//                       />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         <SelectLabel>Availability</SelectLabel>
//                         <SelectItem value="instock">Instock</SelectItem>
//                         <SelectItem value="outofstock">Outofstock</SelectItem>
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                 )}
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() =>
//                       handleQuantityChange(
//                         item.productId,
//                         Math.max(0, item.quantity - 1)
//                       )
//                     }
//                     className="px-2.5 py-1 border rounded bg-gray-200"
//                     disabled={item.quantity <= 0}
//                   >
//                     -
//                   </button>
//                   <Input
//                     value={item.quantity}
//                     onChange={(e) => {
//                       const newValue = Math.max(0, Number(e.target.value))
//                       handleQuantityChange(item.productId, newValue)
//                     }}
//                     className="w-10 h-8 md:w-14 text-center"
//                     min="0"
//                     disabled={!item.available && customer}
//                   />
//                   <button
//                     onClick={() =>
//                       handleQuantityChange(item.productId, item.quantity + 1)
//                     }
//                     className="px-2.5 py-1 border rounded bg-gray-200"
//                   >
//                     +
//                   </button>
//                 </div>

//                 <button
//                   onClick={() => handleRemoveItem(item.id)}
//                   className="bg-red-500 p-1.5 md:p-2 rounded-md"
//                 >
//                   <TrashIcon className="h-4 w-4 md:h-5 md:w-5 text-white" />
//                 </button>
//               </div>
//             </div>
//           )
//         })}
//       </div>
//       <div className="flex flex-col gap-y-3 mt-4">
//         <div className="flex justify-between text-black font-semibold">
//           <p className="text-xs md:text-sm">
//             <span className="text-neutral-500">Subtotal:</span>{" "}
//             {formatCurrency(subtotal, "GHS")}
//           </p>
//           <p className="text-xs md:text-sm">
//             <span className="text-neutral-500">Delivery Fee:</span>{" "}
//             {formatCurrency(orderDetails.deliveryFee, "GHS")}
//           </p>

//           <p className="text-xs md:text-sm">
//             <span className="text-neutral-500">Total:</span>{" "}
//             <span className="">
//               {formatCurrency(subtotal + deliveryFee, "GHS")}
//             </span>
//           </p>
//           <p className="text-xs md:text-sm flex items-center gap-x-2">
//             <span className="text-red-500">Total Due:</span>{" "}
//             {isLoading ? (
//               <span className="loading loading-spinner loading-xs"></span>
//             ) : (
//               <p className="text-xs md:text-sm">
//                 {formatCurrency(updatedOrderTotal, "GHS")}{" "}
//               </p>
//             )}
//           </p>
//         </div>

//         <Button
//           onClick={handleSaveChanges}
//           disabled={isSaving || isLoading}
//           className="bg-sowgren_Color hover:bg-sowgren_Color/85"
//         >
//           {isSaving ? (
//             <span className="loading loading-spinner loading-md"></span>
//           ) : (
//             "Update order"
//           )}
//         </Button>
//       </div>
//     </div>
//   )
// }

// export default EditCustomerOrder

"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Order, ProductOrder } from "@/types"
import Image from "next/image"
import { toast } from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { deductBalance } from "@/lib/actions/deductBalance"
import { useSession } from "next-auth/react"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Trash2, Loader2, Check, X } from "lucide-react"

const EditCustomerOrder = ({
  orders,
  setOrderItems,
  customer,
}: {
  orders: Order
  setOrderItems: React.Dispatch<React.SetStateAction<ProductOrder[]>>
  customer?: boolean
}) => {
  const [orderDetails, setOrderDetails] = useState(orders)
  const [activeUser, setActiveUser] = useState<any>(null)
  const [subtotal, setSubtotal] = useState(0)
  const [deliveryFee, setDeliveryFee] = useState(orders.deliveryFee)
  const [updatedOrderTotal, setUpdatedOrderTotal] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const customerEmail = orders?.shippingAddress?.email
  const balance = activeUser?.user?.balance || 0
  const checkTotal = orders?.paymentAction !== "paid" && balance > 0

  useEffect(() => {
    const getUser = async () => {
      if (!customerEmail) return
      setIsLoading(true)
      try {
        const res = await fetch(`/api/user/${customerEmail}`)
        if (res.ok) {
          const active = await res.json()
          setActiveUser(active)
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error)
      } finally {
        setIsLoading(false)
      }
    }
    getUser()
  }, [customerEmail])

  useEffect(() => {
    if (isLoading) return

    const newSubtotal = orderDetails.products.reduce((sum, item) => {
      if (item.available && item?.product?.isInStock !== "out-of-stock") {
        return sum + item.price * item.quantity
      }
      return sum
    }, 0)

    const newTotal = newSubtotal + deliveryFee
    setSubtotal(parseFloat(newSubtotal.toFixed(2)))

    const { updatedOrderTotal: newUpdatedOrderTotal } = deductBalance(
      balance,
      newTotal
    )

    setUpdatedOrderTotal(newUpdatedOrderTotal)
  }, [orderDetails.products, deliveryFee, balance, checkTotal, isLoading])

  const handleQuantityChange = (productId: string, quantity: number) => {
    const newQuantity = Math.max(1, quantity)
    setOrderDetails((prev) => ({
      ...prev,
      products: prev.products.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      ),
    }))
    setOrderItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const handleRemoveItem = (productOrderId: string) => {
    setOrderDetails((prev) => ({
      ...prev,
      products: prev.products.filter((item) => item.id !== productOrderId),
    }))
    setOrderItems((prev) => prev.filter((item) => item.id !== productOrderId))
    toast.success("Product removed")
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/orders/${orderDetails.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: orderDetails.products,
          total: subtotal,
          deliveryFee,
          updatedOrderTotal,
        }),
      })

      if (response.ok) {
        toast.success("Order updated!")
        setTimeout(() => window.location.reload(), 1000)
      } else {
        const { message } = await response.json()
        toast.error(message || "Update failed")
      }
    } catch (error) {
      toast.error("Update error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-2 p-2">
          {orderDetails.products.map((item) => {
            const outOfStock = item?.product?.isInStock === "out-of-stock"
            const isAvailable = item.available && !outOfStock

            return (
              <div
                key={item.id}
                className={cn(
                  "grid grid-cols-12 items-center p-2 rounded-lg border",
                  !isAvailable && "bg-gray-50"
                )}
              >
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={
                        item?.product?.imageUrl || item?.product?.images[0]?.url
                      }
                      alt={item?.product?.title}
                      fill
                      className="object-contain bg-gray-100 rounded"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium truncate text-sm">
                      {item?.product?.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.price, "GHS")}
                      {item?.weight > 0 && (
                        <span className="text-xs text-gray-400">{` / ${
                          item.weight < 1 ? item.weight * 1000 : item.weight
                        }${item.unit}`}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="col-span-3">
                  {!customer && (
                    <Select
                      onValueChange={(value) => {
                        const isAvailable = value === "instock"
                        setOrderDetails((prev) => ({
                          ...prev,
                          products: prev.products.map((prod) =>
                            prod.productId === item.productId
                              ? { ...prod, available: isAvailable }
                              : prod
                          ),
                        }))
                        setOrderItems((prev) =>
                          prev.map((prod) =>
                            prod.productId === item.productId
                              ? { ...prod, available: isAvailable }
                              : prod
                          )
                        )
                      }}
                      defaultValue={
                        outOfStock
                          ? "outofstock"
                          : item.available
                          ? "instock"
                          : "outofstock"
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="instock" className="text-xs">
                            <div className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-500" /> In
                              Stock
                            </div>
                          </SelectItem>
                          <SelectItem value="outofstock" className="text-xs">
                            <div className="flex items-center gap-2">
                              <X className="h-3 w-3 text-red-500" /> Out of
                              Stock
                            </div>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="col-span-3 flex items-center gap-2">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="h-7 w-7 p-0"
                    >
                      -
                    </Button>
                    <Input
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.productId,
                          Number(e.target.value)
                        )
                      }
                      className="w-12 h-7 text-center border-0"
                      min="1"
                      disabled={!isAvailable && customer}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity + 1)
                      }
                      className="h-7 w-7 p-0"
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-600 h-7 w-7 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="col-span-1 text-right pr-2 font-medium text-sm">
                  {formatCurrency(item.price * item.quantity, "GHS")}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t p-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Subtotal</p>
            <p className="font-medium">{formatCurrency(subtotal, "GHS")}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Delivery</p>
            <p className="font-medium">{formatCurrency(deliveryFee, "GHS")}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-medium">
              {formatCurrency(subtotal + deliveryFee, "GHS")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Balance Due</p>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <p className="font-medium text-green-600">
                {formatCurrency(updatedOrderTotal, "GHS")}
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={handleSaveChanges}
          disabled={isSaving || isLoading}
          className="w-full"
          size="sm"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Save Changes
        </Button>
      </div>
    </div>
  )
}

export default EditCustomerOrder
