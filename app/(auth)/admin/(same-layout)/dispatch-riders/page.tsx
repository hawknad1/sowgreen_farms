"use client"
import React, { useEffect, useState } from "react"

import { DispatchRider } from "@/types"
import DispatchRiderTable from "./DispatchRiderTable"

const RiderListPage = () => {
  const [list, setList] = useState<DispatchRider[]>([])
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
      }
    }
    getRiderList()
  }, [])

  return (
    <div className="p-4">
      <DispatchRiderTable data={list} />
    </div>
  )
}

export default RiderListPage
