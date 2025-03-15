import React from "react"
import { deductBalance } from "@/lib/actions/deductBalance"
import { TableCell } from "@/components/ui/table"
import { useUserStore } from "@/store"
import PaystackPayNow from "./[orderNumber]/PaystackPayNow"
import { Order } from "@/types"

interface PaymentActionCellProps {
  order: Order
}

const PaymentActionCell = ({ order }: PaymentActionCellProps) => {
  const { user } = useUserStore()
  const { updatedBalance } = deductBalance(
    user?.user?.balance,
    order?.total + order?.deliveryFee
  )

  return (
    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
      {order?.paymentMode === "cash" &&
      order?.paymentAction === "pending" &&
      order?.status === "confirmed" ? (
        <PaystackPayNow order={order} updatedBalance={updatedBalance} />
      ) : order?.paymentAction === "paid" ? (
        <p className="bg-emerald-500/15 text-emerald-500 rounded-full px-4 py-0.5 w-20 font-medium tracking-wide">
          Paid
        </p>
      ) : (
        <p className="bg-red-500/15 rounded-full px-4 py-0.5 font-medium tracking-wide text-red-500">
          Pending
        </p>
      )}
    </TableCell>
  )
}

export default PaymentActionCell
