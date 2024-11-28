"use client"

import { Button } from "@/components/ui/button"
import downloadExcel from "@/lib/downloadExcel"
import { useDateRangeStore } from "@/store"
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid"

interface ExportButtonProps {
  date: [Date | null, Date | null]
}

export default function ExportButton() {
  const { dateRange } = useDateRangeStore()

  const handleExport = () => {
    // Use the date range here
    downloadExcel(dateRange[0], dateRange[1])
  }

  return (
    <Button onClick={handleExport} className="w-full max-w-60 flex gap-x-2">
      <ArrowDownTrayIcon className="h-4 w-4" />
      Export
    </Button>
  )
}
