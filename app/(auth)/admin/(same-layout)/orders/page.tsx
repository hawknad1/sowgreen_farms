"use client"
import OrdersDataTable from "@/components/admin/orders/OrdersDataTable"
import { Order } from "@/types"
import React, { useEffect, useState } from "react"

const AdminOrders = () => {
  const [order, setOrder] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  console.log(order, "donne")

  useEffect(() => {
    async function getOrderDetail() {
      try {
        const res = await fetch(`/api/orders`, {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const orderDetail = await res.json()
          setOrder(orderDetail)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getOrderDetail()
  }, [])

  return (
    <div className="h-screen overflow-scroll scrollbar-hide">
      <OrdersDataTable order={order} loading={loading} />
    </div>
  )
}

export default AdminOrders
