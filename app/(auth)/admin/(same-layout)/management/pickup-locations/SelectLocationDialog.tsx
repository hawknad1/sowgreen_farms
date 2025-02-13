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
          className="flex items-center gap-x-2 w-fit h-fit px-4 py-3"
        >
          <SquareCheckBig className="h-5 w-5" />
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
