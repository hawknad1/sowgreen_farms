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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import StatusCards from "./StatusCards"
import { orderStatusCard } from "@/constants"
import { Order } from "@/types"
import StatusUpdateForm from "./StatusUpdateForm"

const StatusPopup = ({
  orderStatus,
  orders,
}: {
  orderStatus?: typeof orderStatusCard
  orders: Order
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="">
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
        <StatusUpdateForm orderStatus={orderStatus} orders={orders} />
      </DialogContent>
    </Dialog>
  )
}

export default StatusPopup
