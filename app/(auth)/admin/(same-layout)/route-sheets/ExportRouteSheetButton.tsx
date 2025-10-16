"use client"

import { Button } from "@/components/ui/button"
import exportDispatchOrdersToExcel from "@/lib/actions/exports/exportRoutSheet"
import { useDateRangeStore } from "@/store"
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid"
import { useState } from "react"

// export default function ExportRouteSheetButton() {
//   const { dateRange } = useDateRangeStore()
//   const [isLoading, setIsLoading] = useState(false) // Loading state

//   const handleExport = async () => {
//     setIsLoading(true) // Set loading state to true
//     try {
//       // Call the export function and wait for it to complete
//       await exportDispatchOrdersToExcel(dateRange[0], dateRange[1])
//       // window.location.reload()
//     } catch (error) {
//       console.error("Export failed:", error) // Handle errors if needed
//     } finally {
//       setIsLoading(false) // Reset loading state
//     }
//   }

//   return (
//     <Button
//       onClick={handleExport}
//       disabled={isLoading} // Disable button while loading
//       className={`w-full max-w-60 flex gap-x-2 ${
//         isLoading ? "opacity-50 cursor-not-allowed" : ""
//       }`}
//     >
//       {isLoading ? (
//         <span className="loading loading-spinner loading-sm"></span> // Add a loading spinner
//       ) : (
//         <>
//           <ArrowDownTrayIcon className="h-4 w-4" />
//           Export
//         </>
//       )}
//     </Button>
//   )
// }

import { format } from "date-fns"

interface ExportRouteSheetButtonProps {
  onSuccess?: () => void
}

// export default function ExportRouteSheetButton({
//   onSuccess,
// }: ExportRouteSheetButtonProps) {
//   const { dateRange } = useDateRangeStore()
//   const [isLoading, setIsLoading] = useState(false)

//   const handleExport = async () => {
//     // Validate date range
//     if (!dateRange[0] || !dateRange[1]) {
//       alert("Please select both start and end dates before exporting.")
//       return
//     }

//     setIsLoading(true)
//     try {
//       await exportDispatchOrdersToExcel(dateRange[0], dateRange[1])

//       // Call onSuccess callback if provided (to close dialog)
//       if (onSuccess) {
//         onSuccess()
//       }
//     } catch (error) {
//       console.error("Export failed:", error)
//       alert("An error occurred while exporting. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Check if dates are selected
//   const isDisabled = isLoading || !dateRange[0] || !dateRange[1]

//   return (
//     <Button
//       onClick={handleExport}
//       disabled={isDisabled}
//       className="flex items-center gap-x-2"
//     >
//       {isLoading ? (
//         <>
//           <svg
//             className="animate-spin h-4 w-4"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             />
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//             />
//           </svg>
//           <span>Exporting...</span>
//         </>
//       ) : (
//         <>
//           <ArrowDownTrayIcon className="h-4 w-4" />
//           <span>Export</span>
//         </>
//       )}
//     </Button>
//   )
// }
export default function ExportRouteSheetButton({
  onSuccess,
}: ExportRouteSheetButtonProps) {
  const { dateRange } = useDateRangeStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    // Validate date range
    if (!dateRange[0] || !dateRange[1]) {
      alert("Please select both start and end dates before exporting.")
      return
    }

    setIsLoading(true)
    try {
      await exportDispatchOrdersToExcel(dateRange[0], dateRange[1])

      // Call onSuccess callback if provided (to close dialog)
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Export failed:", error)
      alert("An error occurred while exporting. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Check if dates are selected
  const isDisabled = isLoading || !dateRange[0] || !dateRange[1]

  return (
    <Button
      onClick={handleExport}
      disabled={isDisabled}
      size="sm"
      className="flex items-center gap-x-2"
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-3.5 w-3.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <ArrowDownTrayIcon className="h-3.5 w-3.5" />
          <span>Export</span>
        </>
      )}
    </Button>
  )
}
