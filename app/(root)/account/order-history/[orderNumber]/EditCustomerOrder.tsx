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

// interface EditOrderProps {
//   orders: Order
//   setOrderItems: React.Dispatch<React.SetStateAction<ProductOrder[]>>
// }

// // const EditCustomerOrder = ({ orders, setOrderItems }: EditOrderProps) => {
// //   const [subtotal, setSubtotal] = useState(0)
// //   const [total, setTotal] = useState(0)
// //   const [isSaving, setIsSaving] = useState(false)

// //   useEffect(() => {
// //     const newSubtotal = orders.products.reduce(
// //       (sum, item) => sum + item.price * item.quantity,
// //       0
// //     )
// //     setSubtotal(parseFloat(newSubtotal.toFixed(2)))
// //     setTotal(newSubtotal)
// //     // setTotal(parseFloat((newSubtotal + orders.deliveryFee).toFixed(2)))
// //   }, [orders.products, orders.deliveryFee])

// //   const handleQuantityChange = (productId: string, quantity: number) => {
// //     setOrderItems((prev) =>
// //       prev.map((item) =>
// //         item.productId === productId ? { ...item, quantity } : item
// //       )
// //     )
// //   }

// //   const handleRemoveItem = (productOrderId: string) => {
// //     setOrderItems((prev) => prev.filter((item) => item.id !== productOrderId))
// //   }

// //   const handleSaveChanges = async () => {
// //     setIsSaving(true)
// //     try {
// //       const response = await fetch(`/api/orders/${orders.id}`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           products: orders.products,
// //           total: subtotal,
// //           deliveryFee: orders.deliveryFee,
// //         }),
// //       })

// //       if (response.ok) {
// //         toast.success("Order updated successfully!")
// //         window.location.reload()
// //       } else {
// //         const { message } = await response.json()
// //         toast.error(`Failed to update order: ${message}`)
// //       }
// //     } catch (error) {
// //       toast.error("An error occurred while updating the order!")
// //     } finally {
// //       setIsSaving(false)
// //     }
// //   }

// //   return (
// //     <div className="flex flex-col justify-between max-h-[400px] ">
// //       <div className="h-[300px] overflow-y-scroll">
// //         {[...orders.products].reverse().map(
// //           (
// //             item // Reverse the array
// //           ) => (
// //             <div
// //               key={item.id}
// //               className="flex items-center justify-between border-b py-2"
// //             >
// //               <div className="flex gap-x-3 items-center">
// //                 <Image
// //                   src={item?.product?.imageUrl || item?.product?.images[0]?.url}
// //                   alt={item?.product?.title}
// //                   height={40}
// //                   width={40}
// //                   className="object-contain h-16 w-16 bg-gray-100 p-1 rounded-md"
// //                 />
// //                 <div>
// //                   <p className="font-semibold text-base text-black">
// //                     {item?.product?.title}
// //                   </p>
// //                   <p className="text-sm">
// //                     {formatCurrency(item?.price, "GHS")}{" "}
// //                     {item?.weight === 0 ? (
// //                       ""
// //                     ) : (
// //                       <span className="text-sm text-neutral-400">{`/ ${
// //                         item?.weight < 1 ? item?.weight * 1000 : item?.weight
// //                       }${item?.unit}`}</span>
// //                     )}{" "}
// //                   </p>
// //                 </div>
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 <Input
// //                   type="number"
// //                   min={1}
// //                   value={item.quantity}
// //                   onChange={(e) =>
// //                     handleQuantityChange(item.productId, Number(e.target.value))
// //                   }
// //                   className="w-16"
// //                 />
// //                 <Button
// //                   variant="destructive"
// //                   onClick={() => handleRemoveItem(item.id)}
// //                 >
// //                   <TrashIcon className="h-5 w-5" />
// //                 </Button>
// //               </div>
// //             </div>
// //           )
// //         )}
// //       </div>
// //       <div className="flex flex-col gap-y-3 mt-4">
// //         <div className="flex justify-between text-black font-semibold">
// //           <p>Subtotal: {formatCurrency(subtotal, "GHS")}</p>
// //           <p>Delivery Fee: {formatCurrency(orders.deliveryFee, "GHS")}</p>
// //           <p>Total: {formatCurrency(total + orders?.deliveryFee, "GHS")}</p>
// //         </div>

// //         <Button onClick={handleSaveChanges} disabled={isSaving}>
// //           {isSaving ? (
// //             <span className="loading loading-spinner loading-md"></span>
// //           ) : (
// //             "Update order"
// //           )}
// //         </Button>
// //       </div>
// //     </div>
// //   )
// // }

// // export default EditCustomerOrder

// const EditCustomerOrder = ({ orders, setOrderItems }: EditOrderProps) => {
//   const [orderDetails, setOrderDetails] = useState(orders) // Local state for orders
//   const [subtotal, setSubtotal] = useState(0)
//   const [total, setTotal] = useState(0)
//   const [isSaving, setIsSaving] = useState(false)

//   // Update subtotal and total whenever products or delivery fee changes
//   useEffect(() => {
//     const newSubtotal = orderDetails.products.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     )
//     setSubtotal(parseFloat(newSubtotal.toFixed(2)))
//     setTotal(newSubtotal + orderDetails.deliveryFee)
//   }, [orderDetails.products, orderDetails.deliveryFee])

//   // Handle quantity change
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

//   // Handle remove item
//   const handleRemoveItem = (productOrderId: string) => {
//     setOrderDetails((prev) => ({
//       ...prev,
//       products: prev.products.filter((item) => item.id !== productOrderId),
//     }))
//     setOrderItems((prev) => prev.filter((item) => item.id !== productOrderId))
//   }

//   // Handle save changes
//   const handleSaveChanges = async () => {
//     setIsSaving(true)
//     try {
//       const response = await fetch(`/api/orders/${orderDetails.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           products: orderDetails.products,
//           total: subtotal,
//           deliveryFee: orderDetails.deliveryFee,
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
//     <div className="flex flex-col justify-between max-h-[400px] ">
//       <div className="h-[300px] overflow-y-scroll">
//         {[...orderDetails.products].reverse().map((item) => (
//           <div
//             key={item.id}
//             className="flex items-center justify-between border-b py-2"
//           >
//             <div className="flex gap-x-3 items-center">
//               <Image
//                 src={item?.product?.imageUrl || item?.product?.images[0]?.url}
//                 alt={item?.product?.title}
//                 height={40}
//                 width={40}
//                 className="object-contain h-16 w-16 bg-gray-100 p-1 rounded-md"
//               />
//               <div>
//                 <p className="font-semibold text-base text-black">
//                   {item?.product?.title}
//                 </p>
//                 <p className="text-sm">
//                   {formatCurrency(item?.price, "GHS")}{" "}
//                   {item?.weight === 0 ? (
//                     ""
//                   ) : (
//                     <span className="text-sm text-neutral-400">{`/ ${
//                       item?.weight < 1 ? item?.weight * 1000 : item?.weight
//                     }${item?.unit}`}</span>
//                   )}{" "}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <Select>
//                 <SelectTrigger className="w-[120px]">
//                   <SelectValue placeholder="Availability" />
//                 </SelectTrigger>
//                 <SelectContent className="">
//                   <SelectGroup className="flex flex-col items-start w-full">
//                     <SelectLabel className="flex justify-center w-full py-2 px-0">
//                       Availability
//                     </SelectLabel>
//                     <SelectItem value={"instock"} className="">
//                       Instock
//                     </SelectItem>
//                     <SelectItem value={"outofstock"}>Outofstock</SelectItem>
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//               <Input
//                 type="number"
//                 min={1}
//                 value={item.quantity}
//                 onChange={(e) =>
//                   handleQuantityChange(item.productId, Number(e.target.value))
//                 }
//                 className="w-16"
//               />
//               <Button
//                 variant="destructive"
//                 onClick={() => handleRemoveItem(item.id)}
//               >
//                 <TrashIcon className="h-5 w-5" />
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="flex flex-col gap-y-3 mt-4">
//         <div className="flex justify-between text-black font-semibold">
//           <p>Subtotal: {formatCurrency(subtotal, "GHS")}</p>
//           <p>Delivery Fee: {formatCurrency(orderDetails.deliveryFee, "GHS")}</p>
//           <p>Total: {formatCurrency(total, "GHS")}</p>
//         </div>

//         <Button onClick={handleSaveChanges} disabled={isSaving}>
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
import { TrashIcon } from "@heroicons/react/24/solid"
import { formatCurrency } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EditOrderProps {
  orders: Order
  setOrderItems: React.Dispatch<React.SetStateAction<ProductOrder[]>>
  customer?: boolean
}

const EditCustomerOrder = ({
  orders,
  setOrderItems,
  customer,
}: EditOrderProps) => {
  const [orderDetails, setOrderDetails] = useState(orders) // Local state for orders
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const newSubtotal = orderDetails.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    setSubtotal(parseFloat(newSubtotal.toFixed(2)))
    setTotal(newSubtotal + orderDetails.deliveryFee)
  }, [orderDetails.products, orderDetails.deliveryFee])

  const handleQuantityChange = (productId: string, quantity: number) => {
    setOrderDetails((prev) => ({
      ...prev,
      products: prev.products.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }))
    setOrderItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const handleRemoveItem = (productOrderId: string) => {
    setOrderDetails((prev) => ({
      ...prev,
      products: prev.products.filter((item) => item.id !== productOrderId),
    }))
    setOrderItems((prev) => prev.filter((item) => item.id !== productOrderId))
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
          deliveryFee: orderDetails.deliveryFee,
        }),
      })

      if (response.ok) {
        toast.success("Order updated successfully!")
        window.location.reload()
      } else {
        const { message } = await response.json()
        toast.error(`Failed to update order: ${message}`)
      }
    } catch (error) {
      toast.error("An error occurred while updating the order!")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col justify-between max-h-[400px] ">
      <div className="h-[300px] overflow-y-scroll">
        {[...orderDetails.products].reverse().map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b py-2"
          >
            <div className="flex gap-x-3 items-center">
              <Image
                src={item?.product?.imageUrl || item?.product?.images[0]?.url}
                alt={item?.product?.title}
                height={40}
                width={40}
                className="object-contain h-16 w-16 bg-gray-100 p-1 rounded-md"
              />
              <div>
                <p className={` `}>
                  <span
                    className={`font-semibold text-base text-black ${
                      !item?.available && "line-through text-red-500 "
                    }`}
                  >
                    {" "}
                    {item?.product?.title}
                  </span>
                  {!item?.available && <span> - N/A</span>}
                </p>
                <p className="text-sm">
                  {formatCurrency(item?.price, "GHS")}{" "}
                  {item?.weight === 0 ? (
                    ""
                  ) : (
                    <span className="text-sm text-neutral-400">{`/ ${
                      item?.weight < 1 ? item?.weight * 1000 : item?.weight
                    }${item?.unit}`}</span>
                  )}{" "}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!customer && (
                <Select
                  onValueChange={(value) => {
                    const isAvailable = value === "instock"
                    console.log(orderDetails, "orderdetails")
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
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue
                      placeholder={item.available ? "Instock" : "Outofstock"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Availability</SelectLabel>
                      <SelectItem value="instock">Instock</SelectItem>
                      <SelectItem value="outofstock">Outofstock</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.productId, Number(e.target.value))
                }
                className="w-16"
                disabled={!item.available && customer}
              />
              <Button
                variant="destructive"
                onClick={() => handleRemoveItem(item.id)}
                className="hidden md:inline-flex"
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-y-3 mt-4">
        <div className="flex justify-between text-black font-semibold">
          <p>Subtotal: {formatCurrency(subtotal, "GHS")}</p>
          <p>Delivery Fee: {formatCurrency(orderDetails.deliveryFee, "GHS")}</p>
          <p>Total: {formatCurrency(total, "GHS")}</p>
        </div>

        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "Update order"
          )}
        </Button>
      </div>
    </div>
  )
}

export default EditCustomerOrder
