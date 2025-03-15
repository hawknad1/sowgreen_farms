import { Button } from "@/components/ui/button"

import { TableCell } from "@/components/ui/table"
import { Order } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import { PaystackButton } from "react-paystack"
import PaystackPayNow from "./[orderNumber]/PaystackPayNow"
import { deductBalance } from "@/lib/actions/deductBalance"
import { useUserStore } from "@/store"
import PaymentActionCell from "./PaymentActionCell"

const handlePaystackSuccessAction = async (reference: any, orderId: string) => {
  try {
    // First POST request to verify the transaction
    const payRes = await fetch(`/api/verify-transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: reference.reference }),
    })

    if (!payRes.ok) throw new Error("Transaction verification failed")

    // Parse the response from the first POST request
    const payData = await payRes.json()

    // Second PUT request to update the order
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentAction: "paid",
        referenceNumber: reference.reference,
        cardType: payData.cardType,
        last4Digits: payData.last4Digits,
        paymentMode: payData.paymentMode, // Include additional fields if needed
      }),
    })

    if (!res.ok) throw new Error("Payment update failed")

    // Notify success
    toast.success("Payment was successful!")
    window.location.reload()
  } catch (error) {
    console.error(error)
    toast.error("Failed to update payment status")
  }
}

const generatePaystackConfig = (order: Order) => ({
  reference: new Date().getTime().toString(),
  email: order?.shippingAddress?.email || "",
  amount: Math.round(
    order?.creditAppliedTotal > 0
      ? order?.creditAppliedTotal * 100
      : ((order.total || 0) + (order?.deliveryFee || 0)) * 100
  ),
  currency: "GHS",
  metadata: {
    custom_fields: [
      {
        display_name: "Name",
        variable_name: "name",
        value: order.shippingAddress?.name || "N/A",
      },
      {
        display_name: "Phone",
        variable_name: "phone",
        value: order.shippingAddress?.phone || "N/A",
      },
    ],
  },
  publicKey: process.env.PAYSTACK_PUBLIC_TEST_KEY || "",
  text: "Pay now",
  onSuccess: (reference?: any) =>
    handlePaystackSuccessAction(reference, order.id),
  onClose: () => console.log("Payment dialog closed"),
})

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order Number",
    cell: ({ row }) => <div>{row.getValue("orderNumber")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Placed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))

      // Format the date in a readable format (e.g., "22/02/2025")
      const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date)

      return <div>{formattedDate}</div>
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.createdAt).getTime()
      const dateB = new Date(rowB.original.createdAt).getTime()
      return dateA - dateB // Ascending order
    },
  },
  {
    accessorKey: "shippingAddress.deliveryMethod",
    header: "Delivery Method",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.shippingAddress.deliveryMethod}
      </div>
    ),
    enableHiding: false,
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = parseFloat(row.getValue("total"))
      const orderTotal = row.original.deliveryFee + total
      const creditAppliedTotal = row.original.creditAppliedTotal
      const updatedOrderTotal = row.original.updatedOrderTotal

      // const formatted = new Intl.NumberFormat("en-US", {
      //   style: "currency",
      //   currency: "GHS",
      // }).format(creditAppliedTotal > 0 ? creditAppliedTotal : orderTotal)
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "GHS",
      }).format(updatedOrderTotal)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    header: "Action",
    id: "paymentAction", // Custom column for actions
    cell: ({ row }) => {
      const order = row.original // Access the original data for the row
      return <PaymentActionCell order={order} />
    },
  },
  // {
  //   header: "Action",
  //   id: "paymentAction", // Custom column for actions
  //   cell: ({ row }) => {
  //     const order = row.original // Access the original data for the row
  //     const { user } = useUserStore()
  //     const { updatedBalance } = deductBalance(
  //       user?.user?.balance,
  //       order?.total + order?.deliveryFee
  //     )

  //     return (
  //       <TableCell align="center" onClick={(e) => e.stopPropagation()}>
  //         {order?.paymentMode === "cash" &&
  //         order?.paymentAction === "pending" &&
  //         order?.status === "confirmed" ? (
  //           <PaystackPayNow order={order} updatedBalance={updatedBalance} />
  //         ) : order?.paymentAction === "paid" ? (
  //           <p className="bg-emerald-500/15 text-emerald-500 rounded-full px-4 py-0.5 w-20 font-medium tracking-wide">
  //             Paid
  //           </p>
  //         ) : (
  //           <p className="bg-red-500/15 rounded-full px-4 py-0.5 font-medium tracking-wide text-red-500">
  //             Pending
  //           </p>
  //         )}
  //       </TableCell>
  //     )
  //   },
  // },
]
