"use client"

import { useState, useMemo } from "react"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import { Order, ShippingAddress } from "@/types"
import { PaystackButton } from "react-paystack"
import Link from "next/link"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"

interface Props {
  shippingAddresses: ShippingAddress[]
}

const OrderHistoryTable = ({ shippingAddresses }: Props) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Total count of orders
  const totalOrdersCount = useMemo(
    () =>
      shippingAddresses.reduce(
        (acc, address) => acc + address.orders.length,
        0
      ),
    [shippingAddresses]
  )

  // Paginated orders
  const paginatedOrders = useMemo(() => {
    const orders = shippingAddresses.flatMap((address) => address.orders)
    return orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [shippingAddresses, page, rowsPerPage])

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handlePaystackSuccessAction = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ paymentAction: "paid" }),
      })
      if (!res.ok) throw new Error("Payment update failed")
      toast.success("Payment was successful!")
    } catch {
      toast.error("Failed to update payment status")
    }
  }

  // const orderTotal = order?.total + order?.deliveryFee

  const generatePaystackConfig = (order: Order) => ({
    reference: new Date().getTime().toString(),
    email: order.shippingAddress?.email,
    amount: Math.round((order.total + order?.deliveryFee) * 100),
    currency: "GHS",
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: order.shippingAddress?.name,
        },
        {
          display_name: "Phone",
          variable_name: "phone",
          value: order.shippingAddress?.phone,
        },
      ],
    },
    publicKey: process.env.PAYSTACK_PUBLIC_TEST_KEY || "",
    text: "Pay now",
    onSuccess: () => handlePaystackSuccessAction(order.id),
    onClose: () => console.log("Payment dialog closed"),
  })

  return (
    <Paper
      sx={{ width: "100%", overflow: "hidden" }}
      className="shadow-none lg:w-[900px]"
    >
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="order history table">
          <TableHead>
            <TableRow>
              <TableCell className="font-bold text-base">Order #</TableCell>
              <TableCell className="font-bold text-base">Date Placed</TableCell>
              <TableCell className="font-bold text-base">
                Delivery Method
              </TableCell>
              <TableCell className="font-bold text-base" align="center">
                Status
              </TableCell>
              <TableCell className="font-bold text-base" align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <TableRow hover key={order.id}>
                  <TableCell>
                    <Link href={`order-history/${order.orderNumber}`}>
                      {order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {order?.shippingAddress?.deliveryMethod || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    <span
                      className={`px-2 py-1 rounded ${
                        order.status === "in-transit"
                          ? "text-emerald-500 bg-emerald-500/15"
                          : order.status === "processing"
                          ? "text-yellow-600 bg-yellow-100/60"
                          : order.status === "delivered"
                          ? "text-red-600 bg-red-100/30"
                          : "text-gray-600 bg-gray-100/30"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    {order?.paymentMode === "cash" &&
                    order?.paymentAction === "cash-on-delivery" &&
                    order?.status === "confirmed" ? (
                      <PaystackButton
                        {...generatePaystackConfig(order)}
                        className="bg-green-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      />
                    ) : order?.paymentAction === "paid" ? (
                      <p>Paid</p>
                    ) : (
                      <p className="bg-neutral-500/15 rounded-full px-1 py-0.5 font-bold text-neutral-500">
                        {/* {order?.paymentAction?.charAt(0).toUpperCase() +
                          order?.paymentAction?.slice(1)} */}
                        Pending
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalOrdersCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default OrderHistoryTable
