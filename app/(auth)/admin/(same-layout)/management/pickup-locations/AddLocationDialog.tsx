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
import { Order } from "@/types"
import { PlusCircleIcon } from "@heroicons/react/20/solid"
import { Button } from "@/components/ui/button"
import LocationForm from "./LocationForm"

interface Props {
  order?: Order
  children?: React.ReactNode
  className?: string
}

const AddLocationDialog = ({ order, children, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="flex items-center gap-x-2 w-fit h-fit px-4 py-3"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Location
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{`Dispatch Riders`}</DialogTitle>
          <DialogDescription>
            Add new rider to list of riders.
          </DialogDescription>
        </DialogHeader>
        <LocationForm />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddLocationDialog
