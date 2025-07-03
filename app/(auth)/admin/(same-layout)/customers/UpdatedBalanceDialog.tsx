"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import React, { forwardRef, useState } from "react"

import UpdateBalanceForm from "./UpdateBalanceForm"
import { Banknote } from "lucide-react"

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
            <Button
              variant={"outline"}
              className={`w-full font-medium cursor-pointer `}
            >
              <div className="flex justify-center items-center gap-2 w-full">
                <Banknote className="h-4 w-4 text-gray-700" />
                <span className="text-sm">Update Balance</span>
              </div>
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
