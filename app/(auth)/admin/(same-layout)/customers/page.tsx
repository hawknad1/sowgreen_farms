"use client"
import React, { useEffect, useState } from "react"
import CustomerDataTable from "./data-table"
import { useRouter } from "next/navigation"
import getInitials from "@/lib/getInitials"
import { useSession } from "next-auth/react"

const Customers = () => {
  const [activeUser, setActiveUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  // const initials = getInitials(user?.name || "")

  const { data: session } = useSession()
  const user = session?.user

  useEffect(() => {
    const getUser = async () => {
      if (!user?.email) return
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/user/${user.email}`, {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const active = await res.json()
          setActiveUser(active)
        } else {
          setError("Failed to fetch user details")
          console.error("Failed to fetch user details:", res.statusText)
        }
      } catch (error) {
        setError("Failed to fetch user details")
        console.error("Failed to fetch user details:", error)
      } finally {
        setIsLoading(false)
      }
    }
    getUser()
  }, [user?.email])

  return (
    <div className="h-screen overflow-scroll scrollbar-none">
      <CustomerDataTable user={activeUser} />
    </div>
  )
}

export default Customers
