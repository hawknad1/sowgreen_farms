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
import React, { forwardRef, useState } from "react"
import { PartnerType } from "./PartnerForm"
import EditPartnerForm from "./EditPartnerForm"

interface Props {
  partner?: PartnerType
}

const EditPartnerDialog = forwardRef<HTMLDivElement, Props>(
  ({ partner }, ref) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div ref={ref}>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Edit Partner
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Partner</DialogTitle>
              <DialogDescription>Modify partner details.</DialogDescription>
            </DialogHeader>
            <EditPartnerForm partner={partner} />
            <DialogFooter />
          </DialogContent>
        </Dialog>
      </div>
    )
  }
)

EditPartnerDialog.displayName = "EditPartnerDialog"

export default EditPartnerDialog
