"use client"
import React, { useState } from "react"
import { Button } from "../ui/button"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { downloadOrders } from "@/lib/xlsx"

import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Order } from "@/types"
import { PencilSquareIcon } from "@heroicons/react/20/solid"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

const ExportDialog = ({ action }: { action: any }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          // onClick={action}
          className="flex items-center gap-x-1.5 px-4 py-2"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Export Sheet`}</DialogTitle>
          <DialogDescription>Download your </DialogDescription>
        </DialogHeader>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExportDialog

// const Export = ({ action }: { action: any }) => {
//   return (
//     <Button onClick={action} className="flex items-center gap-x-1.5 px-4 py-2">
//       <ArrowDownTrayIcon className="h-4 w-4" />
//       Export
//     </Button>
//   )
// }

// export default Export
