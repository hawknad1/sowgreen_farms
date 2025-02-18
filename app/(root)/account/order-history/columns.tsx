// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Order, ShippingAddress } from "@/types"
// import { ColumnDef } from "@tanstack/react-table"
// import { ArrowUpDown, MoreHorizontal } from "lucide-react"

// export const columns: ColumnDef<ShippingAddress>[] = [
//   {
//     accessorKey: "orderNumber",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Order Number
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => <div>{row.getValue("orderNumber")}</div>,
//   },
//   {
//     accessorKey: "status",
//     header: "Date Placed",
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue("status")}</div>
//     ),
//   },
//   {
//     accessorKey: "status",
//     header: "Delivery Method",
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue("status")}</div>
//     ),
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue("status")}</div>
//     ),
//   },
//   {
//     accessorKey: "status",
//     header: "Action",
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue("status")}</div>
//     ),
//   },
//   {
//     accessorKey: "email",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Email
//           <ArrowUpDown />
//         </Button>
//       )
//     },
//     cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
//   },
//   {
//     accessorKey: "amount",
//     header: () => <div className="text-right">Amount</div>,
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("amount"))
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(amount)
//       return <div className="text-right font-medium">{formatted}</div>
//     },
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const payment = row.original
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(payment.id)}
//             >
//               Copy payment ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View customer</DropdownMenuItem>
//             <DropdownMenuItem>View payment details</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell } from "@/components/ui/table"
import { Order } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import { PaystackButton } from "react-paystack"

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
  amount: Math.round(((order.total || 0) + (order?.deliveryFee || 0)) * 100),
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
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
      return <div>{date.toLocaleDateString("en-UK", options)}</div>
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
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "GHS",
      }).format(orderTotal)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },

  {
    header: "Action",
    id: "paymentAction", // Custom column for actions
    cell: ({ row }) => {
      const order = row.original // Access the original data for the row
      return (
        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
          {order?.paymentMode === "cash" &&
          order?.paymentAction === "pending" &&
          order?.status === "confirmed" ? (
            <PaystackButton
              {...generatePaystackConfig(order)}
              className="bg-green-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition"
            />
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
    },
  },

  //   {
  //     id: "actions",
  //     enableHiding: false,
  //     cell: ({ row }) => {
  //       const order = row.original
  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0">
  //               <span className="sr-only">Open menu</span>
  //               <MoreHorizontal />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //             <DropdownMenuItem
  //               onClick={() => navigator.clipboard.writeText(order.id)}
  //             >
  //               Copy Order ID
  //             </DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem>View Details</DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       )
  //     },
  //   },
]

// export const columns: ColumnDef<any>[] = [
//   {
//     accessorKey: "orderNumber",
//     header: "Order Number",
//     cell: ({ row }) => <div>{row.getValue("orderNumber")}</div>,
//   },
//   {
//     accessorKey: "total",
//     header: "Amount",
//     cell: ({ row }) => {
//       const total = parseFloat(row.getValue("total"))
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(total)
//       return <div className="text-right font-medium">{formatted}</div>
//     },
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue("status")}</div>
//     ),
//   },
//   {
//     accessorKey: "referenceNumber",
//     header: "Reference Number",
//     cell: ({ row }) => <div>{row.getValue("referenceNumber")}</div>,
//   },
// ]
