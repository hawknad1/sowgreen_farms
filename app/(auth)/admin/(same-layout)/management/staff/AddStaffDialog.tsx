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
import StaffForm from "./StaffForm"

const AddStaffDialog = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="flex items-center gap-x-2 w-fit h-fit px-4 py-3"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Staff
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{`Staff`}</DialogTitle>
          <DialogDescription>Add new staff.</DialogDescription>
        </DialogHeader>
        <StaffForm />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddStaffDialog
