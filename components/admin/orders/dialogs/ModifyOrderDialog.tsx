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
import toast from "react-hot-toast"
import { Order } from "@/types"
import { PencilSquareIcon } from "@heroicons/react/20/solid"
import EditOrder from "../EditOrder"

interface Props {
  order: Order
  children?: React.ReactNode
  className?: string
}

const ModifyOrderDialog = ({ order, children, className }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit h-fit p-2">
          <PencilSquareIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Modify Order No. ${order.orderNumber}`}</DialogTitle>
          <DialogDescription>
            Edit, remove or add new product to existing order.
          </DialogDescription>
          <EditOrder orders={order} />
        </DialogHeader>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModifyOrderDialog
