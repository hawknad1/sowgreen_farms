"use client"
import { Button } from "@/components/ui/button"
import { Order } from "@/types"
import React, { useState } from "react"
import toast from "react-hot-toast"

interface OrderProps {
  order: Order
  updatedOrderTotal: number
  updatedBalance: number
}

const PayNowButton = ({
  order,
  updatedOrderTotal,
  updatedBalance,
}: OrderProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const proceedToPay = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/orders/${order?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentAction: "paid",
        }),
      })

      if (res.ok) {
        toast.success("Order has been paid!")
      }

      // Update user balance (if applicable)
      await fetch("/api/balance", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email: order?.shippingAddress?.email,
          updatedBalance,
          phone: order?.shippingAddress?.phone,
        }),
      })

      window.location.reload()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      {updatedOrderTotal === 0 && order?.status === "confirmed" ? (
        <Button onClick={proceedToPay} disabled={isLoading}>
          {isLoading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "Pay Now"
          )}
        </Button>
      ) : (
        order?.paymentAction === "paid" && (
          <p className="bg-emerald-500/15 text-emerald-500 text-base font-medium w-fit flex items-center px-4 rounded-md">
            Paid
          </p>
        )
      )}
    </>
  )
}

export default PayNowButton
