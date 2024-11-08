"use client"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import { ShippingAddress } from "@/types"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface UserProps {
  name: string
  email: string
  role: string
}

const OrderHistoryTable = () => {
  const [shippingAddresses, setShippingAddresses] = useState<
    ShippingAddress[] | null
  >(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const router = useRouter()
  const { data: session, status } = useSession()
  const user = session?.user as UserProps

  useEffect(() => {
    if (status === "loading") return
    // if (status === "unauthenticated") router.push("/login")

    async function getOrderList() {
      if (!user?.email) return
      try {
        const res = await fetch(`/api/address/${user.email}`, {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const data = await res.json()
          setShippingAddresses(data)
        } else {
          console.error("Failed to fetch orders: ", res.statusText)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }

    getOrderList()
  }, [user, status, router])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper
      sx={{ width: "100%", overflow: "hidden" }}
      className="shadow-none border border-neutral-200 rounded-md"
    >
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="order history table">
          <TableHead>
            <TableRow>
              <TableCell className="font-bold text-base">Order #</TableCell>
              <TableCell className="font-bold text-base">Date Placed</TableCell>
              <TableCell className="font-bold text-base">
                Shipping Method
              </TableCell>
              <TableCell className="font-bold text-base" align="center">
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippingAddresses && shippingAddresses.length > 0 ? (
              shippingAddresses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((address) =>
                  address.orders.map((order) => (
                    <TableRow hover key={order.id}>
                      <TableCell>
                        <Link href={`order-history/${order.orderNumber}`}>
                          {order.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{order.deliveryMethod || "N/A"}</TableCell>
                      <TableCell align="center">
                        <span
                          className={`px-2 py-1 rounded ${
                            order.status === "shipped"
                              ? "text-emerald-500 bg-emerald-500/15"
                              : order.status === "processing"
                              ? "text-yellow-600 bg-yellow-100/60"
                              : order.status === "delivered"
                              ? "text-red-600 bg-red-100/30"
                              : "text-gray-600 bg-gray-100/30"
                          }`}
                        >
                          {order.status
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={
          shippingAddresses
            ? shippingAddresses.reduce(
                (acc, address) => acc + address.orders.length,
                0
              )
            : 0
        }
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default OrderHistoryTable
