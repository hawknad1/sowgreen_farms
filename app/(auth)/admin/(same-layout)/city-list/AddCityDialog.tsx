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
import CityTable from "./CityTable"

interface Props {
  order?: Order
  children?: React.ReactNode
  className?: string
}

const AddCityDialog = ({ order, children, className }: Props) => {
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
          Add City
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Location and Delivery fee`}</DialogTitle>
          <DialogDescription>
            Add new city to list of locations.
          </DialogDescription>
        </DialogHeader>
        <CityTable />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddCityDialog
