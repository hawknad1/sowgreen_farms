"use client"
import React, { useEffect, useState } from "react"

import { DispatchRider } from "@/types"
import DispatchRiderTable from "./DispatchRiderTable"

const RiderListPage = () => {
  const [list, setList] = useState<DispatchRider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    async function getRiderList() {
      try {
        const res = await fetch("/api/dispatch-riders", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const riderList = await res.json()
          setList(riderList)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    getRiderList()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="py-4">
      <DispatchRiderTable data={list} />
    </div>
  )
}

export default RiderListPage
