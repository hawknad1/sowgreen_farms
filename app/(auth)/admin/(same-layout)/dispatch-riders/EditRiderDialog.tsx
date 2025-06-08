"use client"

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
import { DispatchRider, Staff } from "@/types"
import React, { forwardRef, useState } from "react"
import EditRiderForm from "./EditRiderForm"
import EditStaffForm from "../management/staff/EditStaffForm"

interface Props {
  rider?: Staff
}

const EditRiderDialog = forwardRef<HTMLDivElement, Props>(({ rider }, ref) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div ref={ref}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            Edit Rider
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>
              Modify, remove, or add new details to the location.
            </DialogDescription>
          </DialogHeader>
          {/* <EditRiderForm dispatch={rider} /> */}
          <EditStaffForm staff={rider} />
          <DialogFooter />
        </DialogContent>
      </Dialog>
    </div>
  )
})

EditRiderDialog.displayName = "EditRiderDialog"

export default EditRiderDialog
