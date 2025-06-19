"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { Order } from "@/types"
import { AlertDestructive } from "@/components/alerts/AlertDestructive"

interface Props {
  order: Order
  children?: React.ReactNode
  className?: string
}

const CancelCustomerOrderDialog = ({ order, className }: Props) => {
  const [isCancelling, setIsCancelling] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      const res = await fetch(`/api/orders/${order?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled", // Include the updated status
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(
          errorData.message || `Failed to cancel order. Status: ${res.status}`
        )
      }
      window.location.reload()
      setIsOpen(false)
      toast.success("Order canceled successfully!")
    } catch (error: any) {
      toast.error(error.message || "Error cancelling order.")
      console.error("Cancel order error:", error)
    } finally {
      setIsCancelling(false)
    }
  }

  const buttonDisabled =
    order?.status === "cancelled" || order?.paymentAction === "paid"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={buttonDisabled}
          variant="destructive"
          className={`font-semibold text-xs lg:text-sm w-full hover:bg-red-600 ${className} shadow-sm border border-neutral-200 ${
            order?.status === "confirmed" && "bg-red-500/70 hover:bg-red-500/50"
          }`}
        >
          Cancel
        </Button>
      </DialogTrigger>

      <DialogContent
        className={` ${
          order?.status === "confirmed"
            ? "max-w-2xl h-fit p-1 rounded-lg"
            : "max-w-2xl h-fit flex flex-col py-3 scrollbar-hide overflow-y-scroll rounded-lg"
        }`}
      >
        {order?.status === "confirmed" ? (
          <AlertDestructive
            message="Your order is being confirmed and cannot be modified at this moment. 
            Kindly call Sowgreen Organic on 0546729407 / 0544437775 for assistance. 
            Thank you!"
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{`Cancel Order No. ${order?.orderNumber}`}</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this order?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col gap-y-3 md:inline-flex">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "Confirm"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CancelCustomerOrderDialog
