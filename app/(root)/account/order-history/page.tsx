"use client"

import { Order, ShippingAddress } from "@/types"
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
  const [orders, setOrders] = useState<Order[]>([])
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
        const res = await fetch(`/api/address/${user?.email}`, {
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

  useEffect(() => {
    async function getOrders() {
      try {
        // Construct the URL with the email as a query parameter
        const url = `/api/orders?email=${encodeURIComponent(user?.email)}`

        const ordRes = await fetch(url, {
          method: "GET",
          cache: "no-store",
        })

        if (ordRes.ok) {
          const data = await ordRes.json()
          setOrders(data) // Set the fetched orders
          setLoading(false) // Stop loading state
        } else {
          console.error("Failed to fetch orders:", ordRes.statusText)
          setLoading(false) // Stop loading state on error
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
        setLoading(false) // Stop loading state on error
      }
    }

    if (user && user?.email) {
      getOrders() // Call the function only if the user has an email
    }
  }, [user]) // Dependency array includes `user` to re-run if `user` changes

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    )

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-10 lg:px-8 lg:py-16 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-y-8">
            {/* Title Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Order History
              </h2>
              <p className="text-base text-neutral-600">
                Below is a list of all orders, in reverse chronological order,
                that you have placed with Sowgreen.com.
              </p>
            </div>

            {/* Order History Table */}
            <div className="bg-white overflow-hidden">
              <OrderHistoryTable orders={orders} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderHistoryPage
