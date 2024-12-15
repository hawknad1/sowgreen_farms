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
import { ShippingAddress } from "@/types"
import { PencilSquareIcon } from "@heroicons/react/20/solid"
import EditShippingDetails from "../EditShippingDetails"

interface Props {
  shippingAddress?: ShippingAddress
  children?: React.ReactNode
  className?: string
}

const ModifyShippingDialog = ({ shippingAddress, className }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit h-fit p-1.5">
          <PencilSquareIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Modify address. `}</DialogTitle>
          <DialogDescription>
            Edit, remove or add new product to existing order.
          </DialogDescription>
        </DialogHeader>
        <EditShippingDetails shippingAddress={shippingAddress} />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModifyShippingDialog
