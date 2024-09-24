"use client"
import OrdersDataTable from "@/components/admin/orders/OrdersDataTable"
import React, { useEffect, useState } from "react"

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const OrdersData = async () => {
      try {
        const res = await fetch("/api/orders", {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const orders = await res.json()
          setOrders(orders)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    OrdersData()
  }, [])

  return (
    <div className="h-screen overflow-scroll scrollbar-hide">
      <OrdersDataTable orders={orders} loading={loading} />
    </div>
  )
}

export default AdminOrders
