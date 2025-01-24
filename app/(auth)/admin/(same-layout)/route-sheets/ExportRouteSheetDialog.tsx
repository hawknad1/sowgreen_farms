"use client"

import React from "react"
import ExportButton from "@/app/(auth)/admin/(same-layout)/management/ExportButton"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { DatePickerR } from "@/app/(auth)/admin/(same-layout)/management/DatePicker"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ExportRouteSheetButton from "./ExportRouteSheetButton"

const ExportRouteSheetDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)} // Automatically handles dialog state
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-x-1.5 px-4 py-2">
          <ArrowDownTrayIcon className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Sheet</DialogTitle>
          <DialogDescription>
            Download your data within a date range.
          </DialogDescription>
          {/* Default close button (X) is provided by DialogHeader or DialogContent */}
        </DialogHeader>
        <div className="flex flex-col items-center gap-y-3 w-full justify-center">
          {/* Date Picker directly updates store */}
          <DatePickerR />
          {/* Export button uses the current date range */}
          <ExportRouteSheetButton />
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}

export default ExportRouteSheetDialog
