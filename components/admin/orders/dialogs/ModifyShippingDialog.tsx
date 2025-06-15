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
import { Order, ShippingAddress } from "@/types"
import EditShippingDetails from "../EditShippingDetails"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { AlertDestructive } from "@/components/alerts/AlertDestructive"

interface Props {
  shippingAddress?: ShippingAddress
  children?: React.ReactNode
  className?: string
  order: Order
  balance?: number
}

const ModifyShippingDialog = ({ order, balance }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-fit h-fit p-2"
          disabled={order?.status === "delivered"}
        >
          {/* Change Order Details */}
          <PencilSquareIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className={` ${
          order?.status === "confirmed" ||
          order?.status === "in-transit" ||
          order?.status === "delivered"
            ? "max-w-2xl h-fit p-1"
            : "max-w-3xl h-[500px] flex flex-col py-3"
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
              <DialogTitle>{`Modify address. `}</DialogTitle>
              <DialogDescription>
                Update delivery method and shipping address
              </DialogDescription>
            </DialogHeader>
            <EditShippingDetails order={order} balance={balance} />
            <DialogFooter></DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ModifyShippingDialog
