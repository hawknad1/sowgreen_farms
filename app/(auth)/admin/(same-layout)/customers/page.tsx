"use client"
import React, { useEffect, useState } from "react"
import CustomerDataTable from "./data-table"

const Customers = () => {
  const [users, setUsers] = useState()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function getUsers() {
      setIsLoading(true)
      try {
        const res = await fetch("/api/user", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const users = await res.json()
          setUsers(users)
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getUsers()
  }, [])

  console.log(users, "USERSSS!!!")

  return (
    <div className="h-screen overflow-scroll scrollbar-none">
      <CustomerDataTable users={users} loading={isLoading} />
    </div>
  )
}

export default Customers
