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
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Order } from "@/types"
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/20/solid"
import { Button } from "@/components/ui/button"
import PartnerForm from "./PartnerForm"

interface Props {
  order?: Order
  children?: React.ReactNode
  className?: string
}

const AddPartnerDialog = ({ order, children, className }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="flex items-center gap-x-2 w-fit h-fit px-4 py-3"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Partner
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Partner</DialogTitle>
          <DialogDescription>
            Add new partner to the Sowgreen family.
          </DialogDescription>
        </DialogHeader>
        <PartnerForm />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddPartnerDialog
