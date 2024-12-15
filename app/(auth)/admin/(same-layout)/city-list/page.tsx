"use client"
import React, { useEffect, useState } from "react"
import CityTable from "./CityTable"
import CityandFeeTable from "./CityandFeeTable"
import { CitiesWithFees } from "@/types"

const CityListPage = () => {
  const [list, setList] = useState<CitiesWithFees[]>([])
  useEffect(() => {
    async function getCityList() {
      try {
        const res = await fetch("/api/cities", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const cityList = await res.json()
          setList(cityList)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getCityList()
  }, [])

  return (
    <div className="p-4">
      <CityandFeeTable data={list} />
    </div>
  )
}

export default CityListPage
