"use client"

import { Button } from "@/components/ui/button"
import exportDeliveredSheet from "@/lib/actions/exports/exportDelivered"
import downloadExcel from "@/lib/downloadExcel"
import { useDateRangeStore } from "@/store"
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid"
import { useState } from "react"

export default function ExportDeliveredButton() {
  const { dateRange } = useDateRangeStore()
  const [isLoading, setIsLoading] = useState(false) // Loading state

  const handleExport = async () => {
    setIsLoading(true) // Set loading state to true
    try {
      await exportDeliveredSheet(dateRange[0], dateRange[1]) // Ensure downloadExcel is a promise
      // window.location.reload() // Reload the page after download
    } catch (error) {
      console.error("Export failed:", error) // Handle errors if needed
    } finally {
      setIsLoading(false) // Reset loading state
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isLoading} // Disable button while loading
      className={`w-full max-w-60 flex gap-x-2 ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-sm"></span> // Add a loading spinner
      ) : (
        <>
          <ArrowDownTrayIcon className="h-4 w-4" />
          Export
        </>
      )}
    </Button>
  )
}
