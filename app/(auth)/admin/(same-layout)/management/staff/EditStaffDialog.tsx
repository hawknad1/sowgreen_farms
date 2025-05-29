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
import { Staff } from "@/types"
import React, { forwardRef, useState } from "react"
import EditStaffForm from "./EditStaffForm"

interface Props {
  staff?: Staff
}

const EditStaffDialog = forwardRef<HTMLDivElement, Props>(({ staff }, ref) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div ref={ref}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            Edit Staff
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff</DialogTitle>
            <DialogDescription>
              Modify, remove, or add new details.
            </DialogDescription>
          </DialogHeader>
          <EditStaffForm staff={staff} />
          <DialogFooter />
        </DialogContent>
      </Dialog>
    </div>
  )
})

EditStaffDialog.displayName = "EditStaffDialog"

export default EditStaffDialog
