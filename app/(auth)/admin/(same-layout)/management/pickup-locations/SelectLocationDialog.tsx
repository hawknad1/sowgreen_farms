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
import { Button } from "@/components/ui/button"
import { SquareCheckBig } from "lucide-react"
import { PickupOptions } from "../PickupOptions"

const SelectLocationDialog = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="flex text-xs md:text-sm lg:text-base items-center gap-x-2 w-fit h-fit px-4 py-3"
        >
          <SquareCheckBig className="md:h-5 md:w-5 h-4 w-4" />
          Available Locations
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl rounded-lg">
        <DialogHeader>
          <DialogTitle>Pickup Locations</DialogTitle>
          <DialogDescription>Select available locations.</DialogDescription>
        </DialogHeader>
        {/* <LocationForm /> */}
        <PickupOptions />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SelectLocationDialog
