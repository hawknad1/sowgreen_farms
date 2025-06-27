"use client"
import React, { useEffect, useState } from "react"
import { CitiesWithFees } from "@/types"
import PartnersTable from "./PartnersTable"
import { PartnerType } from "./PartnerForm"

const PartnerListPage = () => {
  const [list, setList] = useState<PartnerType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getPartnerList() {
      try {
        const res = await fetch("/api/management/partners", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const partnerList = await res.json()
          setList(partnerList)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    getPartnerList()
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
      <PartnersTable data={list} />
    </div>
  )
}

export default PartnerListPage
