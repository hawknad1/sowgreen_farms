"use client"
import React, { useEffect, useState } from "react"

import { DispatchRider, Staff } from "@/types"
import DispatchRiderTable from "./StaffTable"
import StaffTable from "./StaffTable"

const StaffPage = () => {
  const [list, setList] = useState<Staff[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    async function getStaffList() {
      try {
        const res = await fetch("/api/management/staff", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const staffList = await res.json()
          setList(staffList)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    getStaffList()
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
      <StaffTable data={list} />
    </div>
  )
}

export default StaffPage
