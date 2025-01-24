"use client"
import React, { useEffect, useState } from "react"

import { DispatchRider, Order } from "@/types"
import RouteSheetTable from "./RouteSheetTable"

const RiderListPage = () => {
  const [list, setList] = useState<Order[]>([])

  console.log(list, "LIST----")

  useEffect(() => {
    async function getOrderList() {
      try {
        const res = await fetch("/api/orders", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const orderList: Order[] = await res.json()

          // Filter orders assigned to a dispatch rider
          const filteredOrders = orderList.filter(
            (order) => order.dispatchRider !== null
          )

          setList(filteredOrders)
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      }
    }

    getOrderList()
  }, [])

  return (
    <div className="p-4">
      <RouteSheetTable data={list} />
    </div>
  )
}

export default RiderListPage
