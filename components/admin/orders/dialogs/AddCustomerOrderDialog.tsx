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
import { SquarePlus } from "lucide-react"

interface Props {
  order?: Order
  children?: React.ReactNode
  className?: string
}

const AddCustomerOrderDialog = ({ order, children, className }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit h-fit p-2">
          <SquarePlus className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Create an order `}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this order? This action cannot be
            undone.
          </DialogDescription>
          {/* <EditOrder orders={order} /> */}
        </DialogHeader>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddCustomerOrderDialog
