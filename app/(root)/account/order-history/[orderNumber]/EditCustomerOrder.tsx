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
import { deductBalance } from "@/lib/actions/deductBalance"
import { useUserStore } from "@/store"

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
  const { user } = useUserStore()

  const balance = user?.user?.balance
  const deliveryFee = orderDetails.deliveryFee
  const checkTotal = orderDetails?.paymentAction !== "paid" && balance > 0

  useEffect(() => {
    const newSubtotal = orderDetails.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const newTotal = newSubtotal + orderDetails.deliveryFee
    setSubtotal(parseFloat(newSubtotal.toFixed(2)))
    setTotal(checkTotal ? newTotal - balance : newTotal)
  }, [orderDetails.products, orderDetails.deliveryFee])

  const orderTotal = orderDetails?.total + orderDetails?.deliveryFee

  const { remainingAmount, updatedBalance, updatedOrderTotal } = deductBalance(
    balance,
    orderTotal
  )

  // useEffect(() => {
  //   const newSubtotal = orderDetails.products.reduce(
  //     (sum, item) => sum + item.price * item.quantity,
  //     0
  //   )

  //   let updatedSubtotal = newSubtotal
  //   let updatedDeliveryFee = orderDetails.deliveryFee
  //   let updatedBalance = balance

  //   if (
  //     orderDetails?.creditAppliedTotal === 0 &&
  //     orderDetails?.paymentAction !== "paid" &&
  //     balance > 0
  //   ) {
  //     // Deduct deliveryFee from balance first
  //     if (balance >= orderDetails.deliveryFee) {
  //       updatedBalance = balance - orderDetails.deliveryFee
  //       updatedDeliveryFee = 0 // Delivery fee is fully covered by balance
  //     } else {
  //       updatedDeliveryFee = orderDetails.deliveryFee - balance
  //       updatedBalance = 0 // Balance is fully used
  //     }

  //     // Deduct remaining balance from subtotal
  //     if (updatedBalance > 0) {
  //       updatedSubtotal = Math.max(newSubtotal - updatedBalance, 0)
  //       updatedBalance = 0 // Balance is fully used
  //     }
  //   }

  //   console.log(deliveryFee, "DDDEEEE")

  //   setSubtotal(parseFloat(updatedSubtotal.toFixed(2)))
  //   setDeliveryFee(parseFloat(updatedDeliveryFee.toFixed(2)))
  //   setTotal(parseFloat((updatedSubtotal + updatedDeliveryFee).toFixed(2)))
  // }, [orderDetails.products, orderDetails.deliveryFee, balance])

  // useEffect(() => {
  //   const newSubtotal = orderDetails.products.reduce(
  //     (sum, item) => sum + item.price * item.quantity,
  //     0
  //   )
  //   setSubtotal(parseFloat(newSubtotal.toFixed(2)))

  //   // Calculate the total based on whether checkTotal is true or false
  //   const calcTotal = checkTotal
  //     ? newSubtotal
  //     : newSubtotal + orderDetails.deliveryFee
  //   setTotal(calcTotal)
  // }, [orderDetails.products, orderDetails.deliveryFee, checkTotal])

  // const { remainingAmount, updatedBalance, updatedOrderTotal } = deductBalance(
  //   balance,
  //   subtotal
  // )

  // If checkTotal is true, set updatedTotal to subtotal
  const updatedTotal = checkTotal ? subtotal : updatedOrderTotal

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
          deliveryFee: deliveryFee,
          creditAppliedTotal: remainingAmount,
        }),
      })

      await fetch("/api/balance", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email: orderDetails?.shippingAddress?.email,
          updatedBalance,
          phone: orderDetails?.shippingAddress?.phone,
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
    <div className="flex flex-col justify-between max-h-[400px]">
      <div className="h-[300px] overflow-y-scroll scrollbar-thin">
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
                className="object-contain h-10 w-10 md:h-16 md:w-16 bg-gray-100 p-1 rounded-md"
              />
              <div>
                <p className={` `}>
                  <span
                    className={`font-semibold max-w-[120px] md:max-w-none line-clamp-1 md:line-clamp-none w-36 md:w-full text-xs md:text-base text-black ${
                      !item?.available && "line-through text-red-500"
                    }`}
                  >
                    {" "}
                    {item?.product?.title}
                  </span>
                  {!item?.available && <span> - N/A</span>}
                </p>
                <p className="text-xs md:text-sm">
                  {formatCurrency(item?.price, "GHS")}{" "}
                  {item?.weight === 0 || item?.weight === null ? (
                    ""
                  ) : (
                    <span className="text-xs md:text-sm text-neutral-400">{`/ ${
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
              {/* <Input
                type="number"
                // min={}
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.productId, Number(e.target.value))
                }
                className="w-16"
                disabled={!item.available && customer}
              /> */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      item.productId,
                      Math.max(0, item.quantity - 1)
                    )
                  }
                  className="px-2.5 py-1 border rounded bg-gray-200"
                  disabled={item.quantity <= 0}
                >
                  -
                </button>
                <Input
                  value={item.quantity}
                  onChange={(e) => {
                    const newValue = Math.max(0, Number(e.target.value))
                    handleQuantityChange(item.productId, newValue)
                  }}
                  className="w-10 h-8 md:w-14 text-center"
                  min="0"
                  disabled={!item.available && customer}
                />
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, item.quantity + 1)
                  }
                  className="px-2.5 py-1 border rounded bg-gray-200"
                >
                  +
                </button>
              </div>

              <button
                // variant="destructive"
                onClick={() => handleRemoveItem(item.id)}
                className="bg-red-500 p-1.5 md:p-2 rounded-md"
              >
                <TrashIcon className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-y-3 mt-4">
        <div className="flex justify-between text-black font-semibold">
          <p className="text-xs md:text-base">
            <span className="text-neutral-500">Subtotal:</span>{" "}
            {formatCurrency(subtotal, "GHS")}
          </p>
          <p className="text-xs md:text-base">
            <span className="text-neutral-500">Delivery Fee:</span>{" "}
            {formatCurrency(orderDetails.deliveryFee, "GHS")}
          </p>
          <p className="text-xs md:text-base">
            <span className="text-neutral-500">Total:</span>{" "}
            {checkTotal ? (
              <>
                {" "}
                <span>{formatCurrency(total, "GHS")}</span>
                <span className="line-through md:text-sm text-neutral-400 ml-2">
                  {formatCurrency(subtotal + deliveryFee, "GHS")}
                </span>
              </>
            ) : (
              <span>{formatCurrency(total, "GHS")}</span>
            )}
          </p>
        </div>

        <Button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="bg-sowgren_Color hover:bg-sowgren_Color/85"
        >
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
