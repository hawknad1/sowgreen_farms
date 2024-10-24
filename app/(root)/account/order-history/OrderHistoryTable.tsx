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
  const session = useSession()
  const user = session?.data?.user as UserProps

  useEffect(() => {
    async function getOrderList() {
      if (!user?.email) return
      try {
        const res = await fetch(`/api/address/${user?.email}`, {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const data = await res.json()
          setShippingAddresses(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getOrderList()
  }, [user])

  return (
    <Table>
      <TableCaption>A list of your recent orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Order #</TableHead>
          <TableHead>Date Placed</TableHead>
          <TableHead>Shipping Method</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shippingAddresses?.map((address) =>
          address.orders.map((order, index) => (
            <TableRow key={order.id || index}>
              <TableCell
                onClick={() =>
                  router.push(`/account/order-history/${order?.orderNumber}`)
                }
                className="font-medium cursor-pointer"
              >
                {order.orderNumber}
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{order.deliveryMethod || "N/A"}</TableCell>
              <TableCell className="text-center ">
                <p className="text-emerald-500 bg-emerald-500/25 rounded-full font-semibold p-0.5">
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
        )}
      </TableBody>
    </Table>
  )
}

export default OrderHistoryTable
