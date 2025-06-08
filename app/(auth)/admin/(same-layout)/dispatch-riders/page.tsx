"use client"
import React, { useEffect, useState } from "react"

import { DispatchRider, Staff } from "@/types"
import DispatchRiderTable from "./DispatchRiderTable"

const RiderListPage = () => {
  const [list, setList] = useState<Staff[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    async function getRiderList() {
      try {
        const res = await fetch("/api/management/staff", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const data = await res.json()
          const riderList = data.filter(
            (rider: Staff) => rider.jobTitle === "dispatch rider"
          )
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
