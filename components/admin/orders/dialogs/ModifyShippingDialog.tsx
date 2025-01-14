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

interface Props {
  shippingAddress?: ShippingAddress
  children?: React.ReactNode
  className?: string
  order: Order
}

const ModifyShippingDialog = ({ order, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit h-fit">
          Change Order Details
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Modify address. `}</DialogTitle>
          <DialogDescription>
            Update customer's delivery address
          </DialogDescription>
        </DialogHeader>
        <EditShippingDetails order={order} />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModifyShippingDialog
