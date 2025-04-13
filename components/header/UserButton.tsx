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
import { useUserListStore, useUserStore } from "@/store"
import { useBalance } from "@/context/BalanceContext"

const UserButton = ({ user }: { user: UserProps }) => {
  const [activeUser, setActiveUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const initials = getInitials(user?.name || "")
  const { balance } = useUserListStore()
  const { setUser } = useUserStore() // Get the setUser method from the store

  // Fetch user details if email is provided
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
          setUser(active)
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
  }, [user?.email, balance])

  // useEffect(() => {
  //   console.log("Active User:", activeUser)
  // }, [activeUser])

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

      {isLoading ? (
        <DropdownMenuItem className="font-bold flex justify-between bg-emerald-500/15 text-emerald-500">
          Balance
          <span className="loading loading-spinner loading-sm"></span>{" "}
          {/* Loading spinner */}
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem
          className={`font-bold flex justify-between ${
            activeUser?.user?.balance >= 0
              ? "bg-emerald-500/15 text-emerald-500"
              : "bg-red-500/15 text-red-500"
          }`}
        >
          Balance
          {/* <span>{formatCurrency(activeUser?.user?.balance, "GHS")}</span> */}
          <span>{formatCurrency(activeUser?.user?.balance, "GHS")}</span>
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
            <div className="flex flex-col gap-y-1">
              <DropdownMenuItem
                onClick={() => router.push("/account/profile")}
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
                onClick={() => router.push("/admin/dashboard")}
                className="text-sm cursor-pointer text-sowgren_Color tracking-wide hover:text-white hover:bg-sowgren_Color"
              >
                Admin Dashboard
              </DropdownMenuItem>

              {isLoading ? (
                <DropdownMenuItem className="font-bold flex justify-between bg-emerald-500/15 text-emerald-500">
                  Balance
                  <span className="loading loading-spinner loading-sm"></span>{" "}
                  {/* Loading spinner */}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className={`font-bold flex justify-between ${
                    activeUser?.user?.balance >= 0
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-red-500/15 text-red-500"
                  }`}
                >
                  Balance
                  <span>
                    {formatCurrency(activeUser?.user?.balance, "GHS")}
                  </span>
                </DropdownMenuItem>
              )}
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
