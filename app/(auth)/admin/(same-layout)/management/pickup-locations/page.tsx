"use client"
import React, { useEffect, useState } from "react"

import { Location } from "@/types"
import LocationDataTable from "./LocationDataTable"

const LocationListPage = () => {
  const [list, setList] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getLocationList() {
      try {
        const res = await fetch("/api/pickup-locations", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const locationList = await res.json()
          setList(locationList)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    getLocationList()
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
      <LocationDataTable data={list} />
    </div>
  )
}

export default LocationListPage
