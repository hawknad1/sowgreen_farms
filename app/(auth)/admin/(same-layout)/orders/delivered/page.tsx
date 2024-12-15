"use client"
import { Order } from "@/types"
import React, { useEffect, useState } from "react"
import DeliveredOrderTable from "./DeliveredOrderTable"

const DeliveredPage = () => {
  const [order, setOrder] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

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
    <div>
      <DeliveredOrderTable order={order} loading={loading} />
    </div>
  )
}

export default DeliveredPage
