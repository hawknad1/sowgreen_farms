"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  const router = useRouter()
  const { data: session, status } = useSession()
  const user = session?.user as UserProps

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated") router.push("/login")

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

  return (
    <Table>
      <TableCaption>A list of your recent orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Order #</TableHead>
          <TableHead>Date Placed</TableHead>
          <TableHead>Shipping Method</TableHead>
          <TableHead className="text-center">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shippingAddresses && shippingAddresses.length > 0 ? (
          shippingAddresses.map((address) =>
            address.orders.map((order, index) => (
              <TableRow key={order.id || index}>
                <Link
                  href={{ pathname: `order-history/${order?.orderNumber}` }}
                >
                  <TableCell className="cursor-pointer">
                    {order?.orderNumber}
                  </TableCell>
                </Link>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.deliveryMethod || "N/A"}</TableCell>
                <TableCell className="text-center">
                  <p className="text-emerald-500 bg-emerald-500/15 rounded-full p-0.5">
                    {order.status
                      .split(" ")
                      .map(
                        (stat) =>
                          stat.charAt(0).toUpperCase() +
                          stat.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </p>
                </TableCell>
              </TableRow>
            ))
          )
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No orders found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default OrderHistoryTable
