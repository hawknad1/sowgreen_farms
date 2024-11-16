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
import { logout } from "@/lib/actions/auth"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserProps {
  name?: string
  email?: string
  role?: string
  emailVerified?: string
  image?: string
  balance?: number
}

export type User = {
  user: {
    id: string
    name: string
    role: string
    balance: number
    email: string
  }
}

const UserButton = ({ user }: { user: UserProps }) => {
  const [activeUser, setActiveUser] = useState<User | null>(null)
  const router = useRouter()
  const initials = getInitials(user?.name)

  // Fetch user details if email is provided
  useEffect(() => {
    const getUser = async () => {
      if (!user?.email) return
      try {
        const res = await fetch(`/api/user/${user.email}`, {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const active = await res.json()
          setActiveUser(active)
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error)
      }
    }
    getUser()
  }, [user?.email])

  // Handle Logout
  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // Common menu items
  const commonMenuItems = (
    <>
      <DropdownMenuLabel>Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => router.push("/account/order-history")}
        className="text-sm focus:bg-accent focus:text-accent-foreground"
      >
        Order History
      </DropdownMenuItem>
      {user.role !== "admin" && (
        <>
          <DropdownMenuItem
            onClick={() => router.push("/account/my-profile")}
            className="text-sm focus:bg-accent focus:text-accent-foreground"
          >
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/account/wish-list")}
            className="text-sm focus:bg-accent focus:text-accent-foreground"
          >
            My Wish List
          </DropdownMenuItem>
        </>
      )}
      {activeUser?.user?.balance > 0 && (
        <DropdownMenuItem className="font-bold flex justify-between bg-emerald-500/15 text-emerald-500">
          Balance
          <span>{`GHS ${activeUser?.user?.balance}`}</span>
        </DropdownMenuItem>
      )}
      <DropdownMenuItem
        onClick={handleLogout}
        className="text-red-500 flex gap-2.5 text-sm hover:bg-red-500/10"
      >
        <LogOut size={16} />
        Logout
      </DropdownMenuItem>
    </>
  )

  return (
    <div className="cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={user?.image} alt={user?.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="outline-none focus-visible:ring-0 ring-0 w-44">
          {user.role === "admin" ? (
            <>
              {commonMenuItems}
              <DropdownMenuItem
                onClick={() => router.push("/admin/dashboard")}
                className="text-base focus:bg-accent focus:text-accent-foreground"
              >
                Admin Dashboard
              </DropdownMenuItem>
            </>
          ) : (
            commonMenuItems
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserButton
