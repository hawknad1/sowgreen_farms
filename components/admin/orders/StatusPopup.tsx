import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import StatusCards from "./StatusCards"
import { orderStatusCard } from "@/constants"
import { Order } from "@/types"
import StatusUpdateForm from "./StatusUpdateForm"
import React, { useState } from "react"

const StatusPopup = ({
  orderStatus,
  orders,
}: {
  orderStatus?: typeof orderStatusCard
  orders: Order
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = () => setIsOpen(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div>
          <StatusCards orderStatus={orderStatus} orders={orders} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Order Status</DialogTitle>
          <DialogDescription>
            Modify the order status. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <StatusUpdateForm
          // orderStatus={orderStatus}
          orders={orders}
          closeModal={closeModal}
        />
      </DialogContent>
    </Dialog>
  )
}

export default StatusPopup
