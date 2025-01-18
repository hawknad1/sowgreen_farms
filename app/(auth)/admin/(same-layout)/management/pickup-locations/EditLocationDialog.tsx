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
import { DispatchRider, Location } from "@/types"
import React, { forwardRef, useState } from "react"
import EditLocationForm from "./EditLocationForm"

interface Props {
  location?: Location
}

const EditLocationDialog = forwardRef<HTMLDivElement, Props>(
  ({ location }, ref) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div ref={ref}>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Edit Location
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Location</DialogTitle>
              <DialogDescription>
                Modify, remove, or add new details to the location.
              </DialogDescription>
            </DialogHeader>
            <EditLocationForm location={location} />
            <DialogFooter />
          </DialogContent>
        </Dialog>
      </div>
    )
  }
)

EditLocationDialog.displayName = "EditLocationDialog"

export default EditLocationDialog
