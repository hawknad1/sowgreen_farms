"use client"

import { ShippingAddress } from "@/types"
import OrderHistoryTable from "./OrderHistoryTable"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface UserProps {
  name: string
  email: string
  role: string
}

const OrderHistoryPage = () => {
  const [shippingAddresses, setShippingAddresses] = useState<
    ShippingAddress[] | null
  >(null)
  const [loading, setLoading] = useState(true)
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
          setLoading(false)
        } else {
          console.error("Failed to fetch orders: ", res.statusText)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }

    getOrderList()
  }, [user, status, router])

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    )

  return (
    <div className="min-h-screen p-10 mb-10 container mx-auto flex justify-center items-center ">
      <div className="flex flex-col gap-y-5">
        <h2 className="text-4xl font-bold">Order History</h2>
        <p className="text-neutral-600">
          Below is a list of all orders, in reverse chronological order, that
          you have placed with Sowgreen.com
        </p>
        {/* Pass orders?.orders array if it's defined */}
        <OrderHistoryTable shippingAddresses={shippingAddresses} />
      </div>
    </div>
  )
}

export default OrderHistoryPage
