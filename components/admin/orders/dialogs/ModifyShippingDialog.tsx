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
  updatedOrderTotal?: number
}

const ModifyShippingDialog = ({ order, balance, updatedOrderTotal }: Props) => {
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
            ? "max-w-2xl h-fit p-1 rounded-lg"
            : "max-w-3xl h-[500px] flex flex-col py-3 rounded-lg"
        }`}
      >
        {order?.status === "confirmed" ||
        order?.status === "in-transit" ||
        order?.status === "delivered" ? (
          <AlertDestructive
            admin={true}
            message="Order status is 'Confirmed'. Switch back to 'Processing' to make changes."
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{`Modify address.`}</DialogTitle>
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
