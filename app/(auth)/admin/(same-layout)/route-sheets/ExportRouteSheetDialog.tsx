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
import { useDateRangeStore } from "@/store"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

// const ExportRouteSheetDialog = () => {
//   const [isOpen, setIsOpen] = React.useState(false)

//   return (
//     <Dialog
//       open={isOpen}
//       onOpenChange={(open) => setIsOpen(open)} // Automatically handles dialog state
//     >
//       <DialogTrigger asChild>
//         <Button className="flex items-center gap-x-1.5 px-4 py-2">
//           <ArrowDownTrayIcon className="h-4 w-4" />
//           Export
//         </Button>
//       </DialogTrigger>

//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Export Sheet</DialogTitle>
//           <DialogDescription>
//             Download your data within a date range.
//           </DialogDescription>
//           {/* Default close button (X) is provided by DialogHeader or DialogContent */}
//         </DialogHeader>
//         <div className="flex flex-col items-center gap-y-3 w-full justify-center">
//           {/* Date Picker directly updates store */}
//           <DatePickerR />
//           {/* Export button uses the current date range */}
//           <ExportRouteSheetButton />
//         </div>
//         <DialogFooter />
//       </DialogContent>
//     </Dialog>
//   )
// }

const ExportRouteSheetDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { dateRange } = useDateRangeStore()

  // Format the selected date range for display
  const getDateRangeText = () => {
    if (dateRange[0] && dateRange[1]) {
      return `${format(dateRange[0], "MMM d, yyyy")} - ${format(dateRange[1], "MMM d, yyyy")}`
    } else if (dateRange[0]) {
      return format(dateRange[0], "MMM d, yyyy")
    }
    return "Select date range"
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-x-2 px-4 py-2">
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span>Export Route Sheet</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <ArrowDownTrayIcon className="h-5 w-5" />
            Export Route Sheet
          </DialogTitle>
          <DialogDescription className="text-sm">
            Select a date range to download dispatch orders.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-1">
          {/* Selected Date Range Display */}
          {(dateRange[0] || dateRange[1]) && (
            <div className="bg-primary/5 rounded-lg p-2.5 border border-primary/20">
              <div className="flex items-center gap-2 text-xs">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span className="font-medium">Selected:</span>
                <span className="font-semibold">{getDateRangeText()}</span>
              </div>
            </div>
          )}

          {/* Date Picker */}
          <div className="border rounded-lg p-2 bg-muted/30">
            <DatePickerR />
          </div>

          {/* Info Box */}
          <div className="flex gap-2 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-xs">
            <svg
              className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-blue-800 dark:text-blue-300">
              Export includes <strong>confirmed orders</strong> with{" "}
              <strong>assigned riders</strong> in the selected range.
            </p>
          </div>
        </div>

        {/* Fixed footer with buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t mt-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} size="sm">
            Cancel
          </Button>
          <ExportRouteSheetButton onSuccess={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

// const ExportRouteSheetDialog = () => {
//   const [isOpen, setIsOpen] = React.useState(false)
//   const { dateRange } = useDateRangeStore()

//   // Format the selected date range for display
//   const getDateRangeText = () => {
//     if (dateRange[0] && dateRange[1]) {
//       return `${format(dateRange[0], "MMM d, yyyy")} - ${format(dateRange[1], "MMM d, yyyy")}`
//     } else if (dateRange[0]) {
//       return format(dateRange[0], "MMM d, yyyy")
//     }
//     return "Select date range"
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button className="flex items-center gap-x-2 px-4 py-2">
//           <ArrowDownTrayIcon className="h-4 w-4" />
//           <span>Export Route Sheet</span>
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="max-w-3xl">
//         <DialogHeader>
//           <DialogTitle className="text-lg font-semibold flex items-center gap-2">
//             <ArrowDownTrayIcon className="h-5 w-5" />
//             Export Route Sheet
//           </DialogTitle>
//           <DialogDescription>
//             Select a date range to download your dispatch orders as an Excel
//             file.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 py-4">
//           {/* Selected Date Range Display */}
//           {(dateRange[0] || dateRange[1]) && (
//             <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
//               <div className="flex items-center gap-2 text-sm">
//                 <CalendarIcon className="h-4 w-4 text-primary" />
//                 <span className="font-medium">Selected:</span>
//                 <span className="font-semibold">{getDateRangeText()}</span>
//               </div>
//             </div>
//           )}

//           {/* Date Picker */}
//           <div className="border rounded-lg p-4 bg-muted/30">
//             <DatePickerR />
//           </div>

//           {/* Info Box */}
//           <div className="flex gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-sm">
//             <svg
//               className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             <p className="text-blue-800 dark:text-blue-300">
//               Export includes all <strong>confirmed orders</strong> with{" "}
//               <strong>assigned riders</strong> in the selected date range.
//             </p>
//           </div>
//         </div>

//         {/* Footer with buttons */}
//         <div className="flex items-center justify-end gap-3 pt-4 border-t">
//           <Button variant="outline" onClick={() => setIsOpen(false)}>
//             Cancel
//           </Button>
//           <ExportRouteSheetButton onSuccess={() => setIsOpen(false)} />
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

export default ExportRouteSheetDialog
