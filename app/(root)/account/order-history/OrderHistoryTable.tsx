// "use client"

// import { useState, useMemo } from "react"
// import Paper from "@mui/material/Paper"
// import Table from "@mui/material/Table"
// import TableBody from "@mui/material/TableBody"
// import TableCell from "@mui/material/TableCell"
// import TableContainer from "@mui/material/TableContainer"
// import TableHead from "@mui/material/TableHead"
// import TablePagination from "@mui/material/TablePagination"
// import TableRow from "@mui/material/TableRow"
// import { Order, ShippingAddress } from "@/types"
// import { PaystackButton } from "react-paystack"
// import Link from "next/link"
// import toast from "react-hot-toast"

// interface Props {
//   shippingAddresses: ShippingAddress[]
// }

// const OrderHistoryTable = ({ shippingAddresses }: Props) => {
//   const [page, setPage] = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(5)

//   // Total count of orders
//   const totalOrdersCount = useMemo(
//     () =>
//       shippingAddresses.reduce(
//         (acc, address) => acc + (address.orders?.length || 0),
//         0
//       ),
//     [shippingAddresses]
//   )

//   // Paginated orders
//   const paginatedOrders = useMemo(() => {
//     const orders = shippingAddresses.flatMap((address) => address.orders || [])
//     return orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//   }, [shippingAddresses, page, rowsPerPage])

//   const handleChangePage = (_: unknown, newPage: number) => {
//     setPage(newPage)
//   }

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setRowsPerPage(parseInt(event.target.value, 10))
//     setPage(0)
//   }

//   const handlePaystackSuccessAction = async (
//     reference: any,
//     orderId: string
//   ) => {
//     try {
//       // First POST request to verify the transaction
//       const payRes = await fetch(`/api/verify-transaction`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ reference: reference.reference }),
//       })

//       if (!payRes.ok) throw new Error("Transaction verification failed")

//       // Parse the response from the first POST request
//       const payData = await payRes.json()

//       // Second PUT request to update the order
//       const res = await fetch(`/api/orders/${orderId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           paymentAction: "paid",
//           referenceNumber: reference.reference,
//           cardType: payData.cardType,
//           last4Digits: payData.last4Digits,
//           paymentMode: payData.paymentMode, // Include additional fields if needed
//         }),
//       })

//       if (!res.ok) throw new Error("Payment update failed")

//       // Notify success
//       toast.success("Payment was successful!")
//       window.location.reload()
//     } catch (error) {
//       console.error(error)
//       toast.error("Failed to update payment status")
//     }
//   }

//   const generatePaystackConfig = (order: Order) => ({
//     reference: new Date().getTime().toString(),
//     email: order?.shippingAddress?.email || "",
//     amount: Math.round(((order.total || 0) + (order?.deliveryFee || 0)) * 100),
//     currency: "GHS",
//     metadata: {
//       custom_fields: [
//         {
//           display_name: "Name",
//           variable_name: "name",
//           value: order.shippingAddress?.name || "N/A",
//         },
//         {
//           display_name: "Phone",
//           variable_name: "phone",
//           value: order.shippingAddress?.phone || "N/A",
//         },
//       ],
//     },
//     publicKey: process.env.PAYSTACK_PUBLIC_TEST_KEY || "",
//     text: "Pay now",
//     onSuccess: (reference?: any) =>
//       handlePaystackSuccessAction(reference, order.id),
//     onClose: () => console.log("Payment dialog closed"),
//   })

//   return (
//     <Paper
//       sx={{ width: "100%", overflow: "hidden" }}
//       className="shadow-none lg:w-[900px]"
//     >
//       <TableContainer sx={{ maxHeight: 440 }}>
//         <Table stickyHeader aria-label="order history table">
//           <TableHead>
//             <TableRow>
//               <TableCell className="font-bold text-base">Order #</TableCell>
//               <TableCell className="font-bold text-base">Date Placed</TableCell>
//               <TableCell className="font-bold text-base">
//                 Delivery Method
//               </TableCell>
//               <TableCell className="font-bold text-base" align="center">
//                 Status
//               </TableCell>
//               <TableCell className="font-bold text-base" align="center">
//                 Action
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedOrders.length > 0 ? (
//               paginatedOrders.map((order: Order) => {
//                 return (
//                   <TableRow hover key={order.id}>
//                     <TableCell>
//                       <Link href={`order-history/${order.orderNumber}`}>
//                         {order.orderNumber}
//                       </Link>
//                     </TableCell>
//                     <TableCell>
//                       {new Date(order.createdAt).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell>
//                       {order?.shippingAddress?.deliveryMethod || "N/A"}
//                     </TableCell>
//                     <TableCell align="center">
//                       <span
//                         className={`px-2 py-1 rounded ${
//                           order.status === "in-transit"
//                             ? "text-emerald-500 bg-emerald-500/15"
//                             : order.status === "processing"
//                             ? "text-yellow-600 bg-yellow-100/60"
//                             : order.status === "delivered"
//                             ? "text-red-600 bg-red-100/30"
//                             : "text-gray-600 bg-gray-100/30"
//                         }`}
//                       >
//                         {order.status.charAt(0).toUpperCase() +
//                           order.status.slice(1)}
//                       </span>
//                     </TableCell>
//                     <TableCell align="center">
//                       {order?.paymentMode === "cash" &&
//                       order?.paymentAction === "pending" &&
//                       order?.status === "confirmed" ? (
//                         <PaystackButton
//                           {...generatePaystackConfig(order)}
//                           className="bg-green-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition"
//                         />
//                       ) : order?.paymentAction === "paid" ? (
//                         <p>Paid</p>
//                       ) : (
//                         <p className="bg-neutral-500/15 rounded-full px-1 py-0.5 font-bold text-neutral-500">
//                           Pending
//                         </p>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 )
//               })
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   No orders found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={totalOrdersCount}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//   )
// }

// export default OrderHistoryTable

"use client"
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation" // For routing
import { columns } from "./columns"
import { Order } from "@/types"

interface Props {
  orders: Order[]
}

const OrderHistoryTable = ({ orders }: Props) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const router = useRouter() // Use Next.js router for navigation

  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    manualPagination: false, // Ensure automatic pagination is enabled
    initialState: {
      pagination: { pageSize: 5 }, // Set the initial page size to 5 rows
    },
  })

  return (
    <div className="w-full">
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() =>
                    router.push(
                      `/account/order-history/${row.original.orderNumber}`
                    )
                  }
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No orders available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <span className="text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  )
}

export default OrderHistoryTable
