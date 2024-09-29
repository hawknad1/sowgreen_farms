import React from "react"
import { Button } from "../ui/button"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { downloadOrders } from "@/lib/xlsx"

const Export = ({ action }: { action: any }) => {
  return (
    <Button onClick={action} className="flex items-center gap-x-1.5 px-4 py-2">
      <ArrowDownTrayIcon className="h-4 w-4" />
      Export
    </Button>
  )
}

export default Export
