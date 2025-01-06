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
import { Order } from "@/types"
import { AlertDestructive } from "@/components/alerts/AlertDestructive"
import ChangeDeliveryMethodForm from "./ChangeDeliveryMethodForm"

interface Props {
  order: Order
  className?: string
}

const ChangeDeliveryMethodDialog = ({ order, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const buttonDisabled =
    order?.status === "cancelled" || order?.paymentAction === "paid"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={buttonDisabled}
          variant="secondary"
          className={`${
            order?.status === "confirmed" &&
            "bg-slate-800 text-white hover:text-black font-medium"
          } text-xs lg:text-sm tracking-wide border border-slate-300`}
        >
          Change Delivery Method
        </Button>
      </DialogTrigger>

      <DialogContent
        className={` ${
          order?.status === "confirmed"
            ? "max-w-2xl h-96 lg:h-fit p-1"
            : "max-w-2xl h-96 lg:h-fit flex flex-col py-3 lg:scrollbar-hide overflow-y-scroll"
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
            <DialogHeader className="px-6 py-2">
              <DialogTitle className="flex items-center justify-between">
                Change Delivery Method
              </DialogTitle>
            </DialogHeader>

            <DialogDescription className="flex-grow">
              <ChangeDeliveryMethodForm order={order} />
            </DialogDescription>

            <DialogFooter />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ChangeDeliveryMethodDialog
