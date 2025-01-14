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

// const AddedProducts = ({ orders, setOrderItems }: EditOrderProps) => {
//   const [subtotal, setSubtotal] = useState(0)
//   const [total, setTotal] = useState(0)

//   useEffect(() => {
//     // Recalculate subtotal and total when products or delivery fee change
//     const newSubtotal = orders.products.reduce((sum, item) => {
//       return sum + item.price * item.quantity
//     }, 0)
//     setSubtotal(parseFloat(newSubtotal.toFixed(2)))
//     setTotal(parseFloat((newSubtotal + orders.deliveryFee).toFixed(2)))
//   }, [orders.products, orders.deliveryFee])

//   const handleQuantityChange = (productId: string, quantity: number) => {
//     if (quantity < 1) return // Prevent invalid quantities

//     setOrderItems((prev) =>
//       prev.map((item) =>
//         item.productId === productId
//           ? {
//               ...item,
//               quantity,
//               quantityTotal: (item.price * quantity).toFixed(2), // Recalculate quantityTotal
//             }
//           : item
//       )
//     )
//   }

//   const handleRemoveItem = (productOrderId: string) => {
//     setOrderItems((prev) => prev.filter((item) => item.id !== productOrderId))
//   }

//   return (
//     <div className="flex flex-col justify-between max-h-[350px]">
//       <div className="h-[250px] overflow-y-scroll">
//         {[...orders.products].reverse().map((item) => (
//           <div
//             key={item.id}
//             className="flex items-center justify-between border-b py-2"
//           >
//             <div className="flex gap-x-3 items-center">
//               <Image
//                 src={item.product.imageUrl || item.product.images[0]?.url}
//                 alt={item.product.title}
//                 height={40}
//                 width={40}
//                 className="object-contain h-16 w-16 bg-gray-100 p-1 rounded-md"
//               />
//               <div>
//                 <p className="font-semibold text-base text-black">
//                   {item.product.title}
//                 </p>
//                 <div className="flex items-center">
//                   <p className="text-sm">
//                     {formatCurrency(item.price || 0, "GHS")}
//                     {item.weight ? (
//                       <span className="text-sm text-neutral-400">{` / ${
//                         item.weight < 1 ? item.weight * 1000 : item.weight
//                       } ${item.unit}`}</span>
//                     ) : null}
//                   </p>

//                   <Select>
//                     <SelectTrigger className="w-[180px]">
//                       <SelectValue placeholder="Weight" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         <SelectLabel>Weight</SelectLabel>
//                         {item?.product.variants?.map((w) => (
//                           <SelectItem value="weight">{w.weight}</SelectItem>
//                         ))}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <Input
//                 type="number"
//                 min={1}
//                 value={item.quantity}
//                 onChange={(e) =>
//                   handleQuantityChange(item.productId, Number(e.target.value))
//                 }
//                 className="w-16"
//               />
//               <p className="text-sm font-bold">{`Total: GHS ${(
//                 item.price * item.quantity
//               ).toFixed(2)}`}</p>
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
//     </div>
//   )
// }

// export default AddedProducts

"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Order, ProductOrder } from "@/types"
import Image from "next/image"
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
}

const AddedProducts = ({ orders, setOrderItems }: EditOrderProps) => {
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const newSubtotal = orders.products.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)
    setSubtotal(parseFloat(newSubtotal.toFixed(2)))
    setTotal(parseFloat((newSubtotal + orders.deliveryFee).toFixed(2)))
  }, [orders.products, orders.deliveryFee])

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setOrderItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              quantityTotal: (item.price * quantity).toFixed(2),
            }
          : item
      )
    )
  }

  const handleRemoveItem = (productOrderId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== productOrderId))
  }

  const handleVariantChange = (
    productId: string,
    selectedVariant: { price: number; weight: number; unit: string }
  ) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, price: selectedVariant.price }
          : item
      )
    )
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
                src={
                  item.product.imageUrl ||
                  item.product.images?.[0]?.url ||
                  "/placeholder-image.png"
                }
                alt={item.product.title || "Product Image"}
                height={40}
                width={40}
                className="object-contain h-16 w-16 bg-gray-100 p-1 rounded-md"
              />
              <div>
                <p className="font-semibold text-base text-black">
                  {item.product.title || "Untitled Product"}
                </p>
                <div className="flex items-center gap-x-2">
                  {item.product.variants && item.product.variants.length > 1 ? (
                    <Select
                      onValueChange={(value) => {
                        const selectedVariant = item.product.variants.find(
                          (variant) => variant.weight.toString() === value
                        )
                        if (selectedVariant) {
                          handleVariantChange(item.productId, selectedVariant)
                        }
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Price/Weight</SelectLabel>
                          {item.product.variants.map((variant, index) => (
                            <SelectItem
                              key={index}
                              value={variant.weight.toString()}
                            >
                              {`${formatCurrency(variant.price, "GHS")} / ${
                                variant.weight < 1
                                  ? variant.weight * 1000
                                  : variant.weight
                              } ${variant.unit}`}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : item.product.variants &&
                    item.product.variants.length === 1 ? (
                    <p className="text-sm text-neutral-600">
                      {`${formatCurrency(item.price, "GHS")} / ${
                        item.product.variants[0].weight
                      } ${item.product.variants[0].unit}`}
                    </p>
                  ) : (
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
                  )}
                </div>
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
