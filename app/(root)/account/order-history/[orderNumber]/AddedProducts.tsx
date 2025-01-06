"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Order, ProductOrder } from "@/types"
import Image from "next/image"
import { toast } from "react-hot-toast"
import { TrashIcon } from "@heroicons/react/24/solid"
import { formatCurrency } from "@/lib/utils"

interface EditOrderProps {
  orders: Order
  setOrderItems: React.Dispatch<React.SetStateAction<ProductOrder[]>>
}

const AddedProducts = ({ orders, setOrderItems }: EditOrderProps) => {
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // Recalculate subtotal and total when products or delivery fee change
    const newSubtotal = orders.products.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)
    setSubtotal(parseFloat(newSubtotal.toFixed(2)))
    setTotal(parseFloat((newSubtotal + orders.deliveryFee).toFixed(2)))
  }, [orders.products, orders.deliveryFee])

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return // Prevent invalid quantities

    setOrderItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              quantityTotal: (item.price * quantity).toFixed(2), // Recalculate quantityTotal
            }
          : item
      )
    )
  }

  const handleRemoveItem = (productOrderId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== productOrderId))
  }

  return (
    <div className="flex flex-col justify-between max-h-[350px]">
      <div className="h-[250px] overflow-y-scroll">
        {[...orders.products].reverse().map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b py-2"
          >
            <div className="flex gap-x-3 items-center">
              <Image
                src={item.product.imageUrl || item.product.images[0]?.url}
                alt={item.product.title}
                height={40}
                width={40}
                className="object-contain h-16 w-16 bg-gray-100 p-1 rounded-md"
              />
              <div>
                <p className="font-semibold text-base text-black">
                  {item.product.title}
                </p>
                <p className="text-sm">
                  {formatCurrency(item.price || 0, "GHS")}
                  {item.weight ? (
                    <span className="text-sm text-neutral-400">{` / ${
                      item.weight < 1 ? item.weight * 1000 : item.weight
                    } ${item.unit}`}</span>
                  ) : null}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.productId, Number(e.target.value))
                }
                className="w-16"
              />
              <p className="text-sm font-bold">{`Total: GHS ${(
                item.price * item.quantity
              ).toFixed(2)}`}</p>
              <Button
                variant="destructive"
                onClick={() => handleRemoveItem(item.id)}
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AddedProducts

// "use client"

// import React, { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Order, ProductOrder } from "@/types"
// import Image from "next/image"
// import { toast } from "react-hot-toast"
// import { TrashIcon } from "@heroicons/react/24/solid"
// import { formatCurrency } from "@/lib/utils"

// interface EditOrderProps {
//   orders: Order
//   setOrderItems: React.Dispatch<React.SetStateAction<ProductOrder[]>>
// }

// const AddedProducts = ({ orders, setOrderItems }: EditOrderProps) => {
//   const [subtotal, setSubtotal] = useState(0)
//   const [total, setTotal] = useState(0)
//   const [isSaving, setIsSaving] = useState(false)

//   useEffect(() => {
//     const newSubtotal = orders.products.reduce(
//       (sum, item) => sum + item.product.price * item.quantity,
//       0
//     )
//     setSubtotal(parseFloat(newSubtotal.toFixed(2)))
//     setTotal(parseFloat((newSubtotal + orders.deliveryFee).toFixed(2)))
//   }, [orders.products, orders.deliveryFee])

//   const handleQuantityChange = (productId: string, quantity: number) => {
//     setOrderItems((prev) =>
//       prev.map((item) =>
//         item.productId === productId ? { ...item, quantity } : item
//       )
//     )
//   }

//   const handleRemoveItem = (productOrderId: string) => {
//     setOrderItems((prev) => prev.filter((item) => item.id !== productOrderId))
//   }

//   return (
//     <div className="flex flex-col justify-between max-h-[350px]">
//       <div className="h-[250px] overflow-y-scroll">
//         {[...orders.products].reverse().map(
//           (
//             item // Reverse the array
//           ) => (
//             <div
//               key={item.id}
//               className="flex items-center justify-between border-b py-2"
//             >
//               <div className="flex gap-x-3 items-center">
//                 <Image
//                   src={item?.product?.imageUrl}
//                   alt={item?.product?.title}
//                   height={40}
//                   width={40}
//                   className="object-contain"
//                 />
//                 <div>
//                   <p className="font-semibold text-base text-black">
//                     {item?.product?.title}
//                   </p>
//                   <p className="text-sm">
//                     {formatCurrency(item?.product?.price, "GHS")}{" "}
//                     {item?.product?.weight === 0 ? (
//                       ""
//                     ) : (
//                       <span className="text-sm text-neutral-400">{`/ ${
//                         item?.product?.weight < 1
//                           ? item?.product?.weight * 1000
//                           : item?.product?.weight
//                       }${item?.product?.unit}`}</span>
//                     )}{" "}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Input
//                   type="number"
//                   min={1}
//                   value={item.quantity}
//                   onChange={(e) =>
//                     handleQuantityChange(item.productId, Number(e.target.value))
//                   }
//                   className="w-16"
//                 />
//                 <Button
//                   variant="destructive"
//                   onClick={() => handleRemoveItem(item.id)}
//                 >
//                   <TrashIcon className="h-5 w-5" />
//                 </Button>
//               </div>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   )
// }

// export default AddedProducts
