// "use client"
// import React, { useEffect, useState } from "react"
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
// import getInitials from "@/lib/getInitials"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu"
// import { logout } from "@/lib/actions/auth"
// import { LogOut } from "lucide-react"
// import { useRouter } from "next/navigation"

// interface UserProps {
//   name?: string
//   email?: string
//   role?: string
//   emailVerified?: string
//   image?: string
//   balance?: number
// }

// export type User = {
//   user: {
//     id: string
//     name: string
//     role: string
//     balance: number
//     email: string
//   }
// }

// const UserButton = ({ user }: { user: UserProps }) => {
//   const [activeUser, setActiveUser] = useState<User | null>(null)
//   const router = useRouter()
//   const initials = getInitials(user?.name)

//   // Fetch user details if email is provided
//   useEffect(() => {
//     const getUser = async () => {
//       if (!user?.email) return
//       try {
//         const res = await fetch(`/api/user/${user.email}`, {
//           method: "GET",
//           cache: "no-store",
//         })
//         if (res.ok) {
//           const active = await res.json()
//           setActiveUser(active)
//         }
//       } catch (error) {
//         console.error("Failed to fetch user details:", error)
//       }
//     }
//     getUser()
//   }, [user?.email])

//   // Handle Logout
//   const handleLogout = async () => {
//     await logout()
//     router.push("/")
//   }

//   // Common menu items
//   const commonMenuItems = (
//     <>
//       <DropdownMenuLabel>Account</DropdownMenuLabel>
//       <DropdownMenuSeparator />
//       <DropdownMenuItem
//         onClick={() => router.push("/account/order-history")}
//         className="text-sm focus:bg-accent focus:text-accent-foreground cursor-pointer"
//       >
//         Order History
//       </DropdownMenuItem>
//       {user.role !== "admin" && (
//         <>
//           <DropdownMenuItem
//             onClick={() => router.push("/account/my-profile")}
//             className="text-sm focus:bg-accent focus:text-accent-foreground cursor-pointer"
//           >
//             My Profile
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             onClick={() => router.push("/account/wish-list")}
//             className="text-sm focus:bg-accent focus:text-accent-foreground cursor-pointer"
//           >
//             My Wish List
//           </DropdownMenuItem>
//         </>
//       )}
//       {activeUser?.user?.balance > 0 && (
//         <DropdownMenuItem className="font-bold flex justify-between bg-emerald-500/15 text-emerald-500">
//           Balance
//           <span>{`GHS ${activeUser?.user?.balance}`}</span>
//         </DropdownMenuItem>
//       )}
//       <DropdownMenuItem
//         onClick={handleLogout}
//         className="text-red-500 flex gap-2.5 text-sm hover:bg-red-500/10 cursor-pointer"
//       >
//         <LogOut size={16} />
//         Logout
//       </DropdownMenuItem>
//     </>
//   )

//   return (
//     <div className="cursor-pointer">
//       <DropdownMenu>
//         <DropdownMenuTrigger>
//           <Avatar className="h-8 w-8 rounded-full">
//             <AvatarImage src={user?.image} alt={user?.name} />
//             <AvatarFallback>{initials}</AvatarFallback>
//           </Avatar>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="outline-none focus-visible:ring-0 ring-0 w-44">
//           {user.role === "admin" ? (
//             <>
//               {commonMenuItems}
//               <DropdownMenuItem
//                 onClick={() => router.push("/admin/dashboard")}
//                 className="text-sm focus:bg-accent focus:text-accent-foreground"
//               >
//                 Admin Dashboard
//               </DropdownMenuItem>
//             </>
//           ) : (
//             commonMenuItems
//           )}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   )
// }

// export default UserButton

"use client"

import React, { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import getInitials from "@/lib/getInitials"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Skeleton } from "../ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import { UserProps } from "@/types"

const UserButton = ({ user }: { user: UserProps }) => {
  const [activeUser, setActiveUser] = useState<UserProps | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const initials = getInitials(user?.name || "")

  // Fetch user details if email is provided
  useEffect(() => {
    const getUser = async () => {
      if (!user?.email) return
      setIsLoading(true)
      try {
        const res = await fetch(`/api/user/${user.email}`, {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const active = await res.json()
          setActiveUser(active)
        } else {
          console.error("Failed to fetch user details:", res.statusText)
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error)
      } finally {
        setIsLoading(false)
      }
    }
    getUser()
  }, [user?.email])

  // Handle Logout
  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
    router.refresh() // Force a refresh to update the session state
  }

  // Common menu items
  const commonMenuItems = (
    <>
      <DropdownMenuLabel>Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {user.role !== "admin" && (
        <>
          <DropdownMenuItem
            onClick={() => router.push("/account/my-profile")}
            className="text-sm text-sowgren_Color tracking-wide hover:text-white hover:bg-sowgren_Color cursor-pointer"
          >
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/account/order-history")}
            className="text-sm text-sowgren_Color tracking-wide hover:text-white hover:bg-sowgren_Color cursor-pointer"
          >
            Order History
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/account/wish-list")}
            className="text-sm text-sowgren_Color tracking-wide hover:text-white hover:bg-sowgren_Color cursor-pointer"
          >
            My Wish List
          </DropdownMenuItem>
        </>
      )}
      {activeUser?.balance > 0 && (
        <DropdownMenuItem className="font-bold flex justify-between bg-emerald-500/15 text-emerald-500">
          Balance
          <span>{formatCurrency(activeUser.balance, "GHS")}</span>
        </DropdownMenuItem>
      )}
      <DropdownMenuItem
        onClick={handleLogout}
        className="text-red-500 flex gap-2.5 text-sm hover:bg-red-500/10 cursor-pointer"
      >
        <LogOut size={16} />
        Logout
      </DropdownMenuItem>
    </>
  )

  return (
    <div className="cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="User menu">
          {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : (
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarImage src={user?.image} alt={user?.name || "User"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="outline-none focus-visible:ring-0 ring-0 w-44">
          {user.role === "admin" ? (
            <div className="flex flex-col gap-y-2">
              {/* {commonMenuItems} */}
              <DropdownMenuItem
                onClick={() => router.push("/account/order-history")}
                className="text-sm text-sowgren_Color tracking-wide hover:text-white hover:bg-sowgren_Color cursor-pointer"
              >
                Order History
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/admin/dashboard")}
                className="text-sm cursor-pointer text-sowgren_Color tracking-wide hover:text-white hover:bg-sowgren_Color"
              >
                Admin Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 flex gap-2.5 text-sm hover:bg-red-500/10 cursor-pointer mt-5 "
              >
                <LogOut size={16} />
                Logout
              </DropdownMenuItem>
            </div>
          ) : (
            commonMenuItems
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default React.memo(UserButton)

// "use client"

// import React, { useEffect, useState } from "react"
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
// import getInitials from "@/lib/getInitials"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu"
// import { logout } from "@/lib/actions/auth"
// import { LogOut } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { Skeleton } from "../ui/skeleton"
// import { formatCurrency } from "@/lib/utils"
// import { UserProps } from "@/types"

// const UserButton = ({ user }: { user: UserProps }) => {
//   const [activeUser, setActiveUser] = useState<UserProps | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()
//   const initials = getInitials(user?.name || "")

//   // Fetch user details if email is provided
//   useEffect(() => {
//     const getUser = async () => {
//       if (!user?.email) return
//       setIsLoading(true)
//       try {
//         const res = await fetch(`/api/user/${user.email}`, {
//           method: "GET",
//           cache: "no-store",
//         })
//         if (res.ok) {
//           const active = await res.json()
//           setActiveUser(active)
//         } else {
//           console.error("Failed to fetch user details:", res.statusText)
//         }
//       } catch (error) {
//         console.error("Failed to fetch user details:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     getUser()
//   }, [user?.email])

//   // Handle Logout
//   const handleLogout = async () => {
//     await logout()
//     router.push("/")
//     router.refresh()
//   }

//   // Common menu items
//   const commonMenuItems = (
//     <>
//       <DropdownMenuLabel>Account</DropdownMenuLabel>
//       <DropdownMenuSeparator />
//       {user.role !== "admin" && (
//         <>
//           <DropdownMenuItem
//             onClick={() => router.push("/account/my-profile")}
//             className="text-sm text-sowgren_Color tracking-wide hover:text-white hover:bg-sowgren_Color cursor-pointer"
//           >
//             My Profile
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             onClick={() => router.push("/account/order-history")}
//             className="text-sm text-sowgren_Color tracking-wide hover:text-white hover:bg-sowgren_Color cursor-pointer"
//           >
//             Order History
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             onClick={() => router.push("/account/wish-list")}
//             className="text-sm text-sowgren_Color tracking-wide hover:text-white hover:bg-sowgren_Color cursor-pointer"
//           >
//             My Wish List
//           </DropdownMenuItem>
//         </>
//       )}
//       {activeUser?.balance > 0 && (
//         <DropdownMenuItem className="font-bold flex justify-between bg-emerald-500/15 text-emerald-500">
//           Balance
//           <span>{formatCurrency(activeUser.balance, "GHS")}</span>
//         </DropdownMenuItem>
//       )}
//       <DropdownMenuItem
//         onClick={handleLogout}
//         className="text-red-500 flex gap-2.5 text-sm hover:bg-red-500/10 cursor-pointer"
//       >
//         <LogOut size={16} />
//         Logout
//       </DropdownMenuItem>
//     </>
//   )

//   return (
//     <div className="cursor-pointer">
//       <DropdownMenu>
//         <DropdownMenuTrigger aria-label="User menu">
//           {isLoading ? (
//             <Skeleton className="h-10 w-10 rounded-full" />
//           ) : (
//             <Avatar className="h-10 w-10 rounded-full">
//               <AvatarImage src={user?.image} alt={user?.name || "User"} />
//               <AvatarFallback>{initials}</AvatarFallback>
//             </Avatar>
//           )}
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="outline-none focus-visible:ring-0 ring-0 w-44">
//           {user.role === "admin" ? (
//             <div className="flex flex-col gap-y-2">
//               {/* {commonMenuItems} */}
//               <DropdownMenuItem
//                 onClick={() => router.push("/account/order-history")}
//                 className="text-sm text-sowgren_Color tracking-wide hover:text-white hover:bg-sowgren_Color cursor-pointer"
//               >
//                 Order History
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => router.push("/admin/dashboard")}
//                 className="text-sm cursor-pointer text-sowgren_Color tracking-wide hover:text-white hover:bg-sowgren_Color"
//               >
//                 Admin Dashboard
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => logout()}
//                 className="text-red-500 flex gap-2.5 text-sm hover:bg-red-500/10 cursor-pointer mt-5 "
//               >
//                 <LogOut size={16} />
//                 Logout
//               </DropdownMenuItem>
//             </div>
//           ) : (
//             commonMenuItems
//           )}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   )
// }

// export default React.memo(UserButton)
