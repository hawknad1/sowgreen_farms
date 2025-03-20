// "use client"
// import React, { useEffect, useState } from "react"
// import CustomerDataTable from "./data-table"

// const Customers = () => {
//   const [users, setUsers] = useState()
//   const [isLoading, setIsLoading] = useState(false)

//   useEffect(() => {
//     async function getUsers() {
//       setIsLoading(true)
//       try {
//         const res = await fetch("/api/user", {
//           method: "GET",
//           cache: "no-store",
//         })

//         if (res.ok) {
//           const users = await res.json()
//           setUsers(users)
//           setIsLoading(false)
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     getUsers()
//   }, [])

//   console.log(users, "USERSSS!!!")

//   return (
//     <div className="h-screen overflow-scroll scrollbar-none">
//       <CustomerDataTable users={users} loading={isLoading} />
//     </div>
//   )
// }

// export default Customers

"use client"
import React, { useEffect, useState } from "react"
import { Order } from "@/types"
import CustomerDataTableList from "./customerDataTable"
import { useUserListStore } from "@/store"
import { getUserList } from "@/lib/getUserList"

export type UserDetailType = {
  id: string
  name?: string
  email?: string
  orders: Order[]
  balance?: number
  role: string
  image?: string | null
  createdAt: string
  updatedAt: string
  emailVerified?: string | null
  phone?: string | null
}

const CustomersPage = () => {
  const [users, setUsers] = useState<UserDetailType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserList() {
      try {
        const users = await getUserList()
        setUsers(users)
      } catch (error) {
        console.error("Error fetching user list:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserList()
  }, [])

  return (
    <div className="py-4">
      <CustomerDataTableList users={users} loading={loading} />
    </div>
  )
}

export default CustomersPage
