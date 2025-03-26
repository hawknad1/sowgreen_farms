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
import { SquarePen, SquarePenIcon } from "lucide-react"
import { PencilSquareIcon } from "@heroicons/react/24/outline"

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
        <Button
          variant="outline"
          className="w-fit h-fit p-2"
          disabled={order?.status === "delivered"}
        >
          {/* Change Order Details */}
          <PencilSquareIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-lg">
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
