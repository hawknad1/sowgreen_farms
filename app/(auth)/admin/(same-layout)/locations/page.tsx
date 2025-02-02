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
import { PlusCircleIcon } from "@heroicons/react/20/solid"
import { Button } from "@/components/ui/button"

const PickupLocation = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="flex items-center gap-x-2 w-fit h-fit px-4 py-3"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Pickup Locations
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Location and Delivery fee`}</DialogTitle>
          <DialogDescription>Select locations.</DialogDescription>
        </DialogHeader>
        {/* <PickupLocation /> */}
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PickupLocation
