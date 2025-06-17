"use client"

import React, { useState } from "react"
import { Button } from "../../../ui/button"
import { Order } from "@/types"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog"
import EditOrderDetails from "../EditOrderDetails"
import { SquarePenIcon } from "lucide-react"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { AlertDestructive } from "@/components/alerts/AlertDestructive"

interface Props {
  order?: Order
  children?: React.ReactNode
  className?: string
}

const ModifyOrderDetailsDialog = ({ order, children, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-fit h-fit p-2"
          disabled={order?.status === "delivered"}
        >
          <PencilSquareIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className={` ${
          order?.status === "confirmed" ||
          order?.status === "in-transit" ||
          order?.status === "delivered"
            ? "max-w-2xl h-fit p-1 rounded-lg"
            : "max-w-sm rounded-lg"
        }`}
      >
        {order?.status === "confirmed" ||
        order?.status === "in-transit" ||
        order?.status === "delivered" ? (
          <AlertDestructive
            message="Your order is being confirmed and cannot be modified at this moment. 
                    Kindly call Sowgreen Organic on 0546729407 / 0544437775 for assistance. 
                    Thank you!"
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Update Payment Action</DialogTitle>
              <DialogDescription>Update payment action.</DialogDescription>
            </DialogHeader>
            <EditOrderDetails order={order} />
            <DialogFooter></DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ModifyOrderDetailsDialog
