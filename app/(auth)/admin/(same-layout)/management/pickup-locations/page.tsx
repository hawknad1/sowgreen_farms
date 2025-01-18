"use client"
import React, { useEffect, useState } from "react"

import { DispatchRider, Location } from "@/types"
import LocationDataTable from "./LocationDataTable"

const LocationListPage = () => {
  const [list, setList] = useState<Location[]>([])

  console.log(list, "lieeestt")
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
      }
    }
    getLocationList()
  }, [])

  return (
    <div className="p-4">
      <LocationDataTable data={list} />
    </div>
  )
}

export default LocationListPage
