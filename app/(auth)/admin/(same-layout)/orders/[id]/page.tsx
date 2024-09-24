"use client"
import AdminOrderDetailCard from "@/components/admin/orders/AdminOrderDetailCard"
import { Order } from "@/types"
import React, { useEffect, useState } from "react"

const OrderDetailPage = ({ params }: { params: { id: string } }) => {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  console.log(params.id)

  useEffect(() => {
    async function getOrderDetail() {
      try {
        const res = await fetch(`/api/orders/${params.id}`, {
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
  }, [params.id])

  return (
    <div>
      <AdminOrderDetailCard orders={order} />
    </div>
  )
}

export default OrderDetailPage
