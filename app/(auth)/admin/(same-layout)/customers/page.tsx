"use client"
import React, { useEffect, useState } from "react"
import { Order, UserDetailType } from "@/types"
import CustomerDataTableList from "./CustomerDataTableList"

const AdminCustomerPage = () => {
  const [userList, setUserList] = useState<UserDetailType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getOrderDetail() {
      try {
        const res = await fetch(`/api/user`, {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const users = await res.json()
          setUserList(users)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getOrderDetail()
  }, [])

  return (
    <div className="h-screen overflow-scroll scrollbar-none px-3">
      <CustomerDataTableList users={userList} loading={loading} />
    </div>
  )
}

export default AdminCustomerPage
