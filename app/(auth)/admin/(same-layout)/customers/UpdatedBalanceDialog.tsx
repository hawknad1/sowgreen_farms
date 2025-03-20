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
import { CitiesWithFees } from "@/types"
import React, { forwardRef, useState } from "react"
import UpdateBalanceForm from "./UpdateBalanceForm"
import AddCreditForm from "@/components/forms/AddCreditForm"
import { formatCurrency } from "@/lib/utils"

interface Props {
  customer: any
}

const UpdateBalanceDialog = forwardRef<HTMLDivElement, Props>(
  ({ customer }, ref) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div ref={ref}>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Update Balance
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Customer Balance</DialogTitle>
            </DialogHeader>
            <UpdateBalanceForm customer={customer} />
            <DialogFooter />
          </DialogContent>
        </Dialog>
      </div>
    )
  }
)

UpdateBalanceDialog.displayName = "UpdateBalanceDialog"

export default UpdateBalanceDialog
