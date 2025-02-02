// "use client"
// import React, { useEffect, useState } from "react"

// import { DispatchRider, Order } from "@/types"
// import RouteSheetTable from "./RouteSheetTable"

// const RiderListPage = () => {
//   const [list, setList] = useState<Order[]>([])

//   useEffect(() => {
//     async function getOrderList() {
//       try {
//         const res = await fetch("/api/orders", {
//           method: "GET",
//           cache: "no-store",
//         })

//         if (res.ok) {
//           const orderList: Order[] = await res.json()

//           // Filter orders assigned to a dispatch rider
//           const filteredOrders = orderList.filter(
//             (order) =>
//               order.dispatchRider !== null && order?.status !== "delivered"
//           )

//           setList(filteredOrders)
//         }
//       } catch (error) {
//         console.error("Failed to fetch orders:", error)
//       }
//     }

//     getOrderList()
//   }, [])

//   return (
//     <div className="p-4">
//       <RouteSheetTable data={list} />
//     </div>
//   )
// }

// export default RiderListPage

"use client"
import React, { useEffect, useState } from "react"
import { Order } from "@/types"
import RouteSheetTable from "./RouteSheetTable"

const RiderListPage = () => {
  const [list, setList] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    async function getOrderList() {
      try {
        const res = await fetch("/api/orders", {
          method: "GET",
          cache: "no-store",
          signal: abortController.signal,
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch orders: ${res.statusText}`)
        }

        const orderList: Order[] = await res.json()

        // Filter orders assigned to a dispatch rider
        const filteredOrders = orderList.filter(
          (order) =>
            order.dispatchRider !== null && order.status !== "delivered"
        )

        setList(filteredOrders)
      } catch (error) {
        // Type guard to check if the error is an instance of Error
        if (error instanceof Error) {
          if (error.name !== "AbortError") {
            console.error("Failed to fetch orders:", error)
            setError(error.message)
          }
        } else {
          // Handle cases where the error is not an instance of Error
          console.error("An unknown error occurred:", error)
          setError("An unknown error occurred")
        }
      } finally {
        setIsLoading(false)
      }
    }

    getOrderList()

    // Cleanup function to abort the fetch request if the component unmounts
    return () => {
      abortController.abort()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-4">
      <RouteSheetTable data={list} />
    </div>
  )
}

export default RiderListPage
