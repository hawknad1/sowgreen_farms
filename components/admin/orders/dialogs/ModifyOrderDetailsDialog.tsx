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
        <Button variant="outline" className="">
          {/* <PencilSquareIcon className="h-5 w-5" /> */}
          Change Delivery Method
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Update Delivery Method</DialogTitle>
          <DialogDescription>
            Update the delivery method of an existing order.
          </DialogDescription>
        </DialogHeader>
        <EditOrderDetails order={order} />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModifyOrderDetailsDialog
