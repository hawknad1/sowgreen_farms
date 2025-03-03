"use client"

import React from "react"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"

import ExportButton from "@/app/(auth)/admin/(same-layout)/management/ExportButton"
import { DatePickerR } from "@/app/(auth)/admin/(same-layout)/management/DatePicker"
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
import ExportDeliveredButton from "./ExportDeliveredButton"

const ExportDeliveredDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)} // Automatically handles dialog state
    >
      <DialogTrigger asChild>
        <button className="flex w-fit items-center gap-x-2 text-sm bg-sowgren_Color text-white hover:bg-sowgren_Color/85 md:text-base py-2.5 px-4 rounded-lg">
          <ArrowDownTrayIcon className="h-5 w-5 md:h-6 md:w-6" />
          Export
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Delivered Orders</DialogTitle>
          <DialogDescription>
            Download your data within a date range.
          </DialogDescription>
          {/* Default close button (X) is provided by DialogHeader or DialogContent */}
        </DialogHeader>
        <div className="flex flex-col items-center gap-y-3 w-full justify-center">
          {/* Date Picker directly updates store */}
          <DatePickerR />
          {/* Export button uses the current date range */}
          <ExportDeliveredButton />
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}

export default ExportDeliveredDialog
