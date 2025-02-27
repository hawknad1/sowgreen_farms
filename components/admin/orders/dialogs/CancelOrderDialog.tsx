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
} from "../../../ui/dialog"
import { Button } from "../../../ui/button"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Order } from "@/types"

interface Props {
  order: Order
  children?: React.ReactNode
  className?: string
}

const CancelOrderDialog = ({ order, children, className }: Props) => {
  const [isCancelling, setIsCancelling] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className={`font-semibold text-xs lg:text-sm w-fit hover:bg-slate-200 ${className} shadow-sm border border-neutral-200 `}
        >
          Cancel Order
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Cancel Order No. ${order.orderNumber}`}</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this order?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
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
      </DialogContent>
    </Dialog>
  )
}

export default CancelOrderDialog
