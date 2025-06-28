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
import { signOut, useSession } from "next-auth/react"
import { LogOut, User, ShoppingBag, Heart, LayoutDashboard } from "lucide-react"
import { useRouter } from "next/navigation"
import { Skeleton } from "../ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import { UserProps } from "@/types"
import { useUserStore } from "@/store"
import { motion } from "framer-motion"

const UserButton = ({ user }: { user: UserProps }) => {
  const [activeUser, setActiveUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const initials = getInitials(user?.name || "")
  const { setUser } = useUserStore()

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
  }, [user?.email])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
    router.refresh()
  }

  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
      },
    }),
  }

  const renderMenuItem = (
    onClick: () => void,
    label: string,
    icon: React.ReactNode,
    index: number,
    isAdmin?: boolean
  ) => (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={menuItemVariants}
    >
      <DropdownMenuItem
        onClick={onClick}
        className={`flex items-center cursor-pointer gap-3 px-4 py-2.5 text-sm rounded-md transition-colors ${
          isAdmin
            ? "text-purple-600 hover:bg-purple-50"
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        <span className="text-gray-500">{icon}</span>
        {label}
      </DropdownMenuItem>
    </motion.div>
  )

  const renderBalance = () => (
    <motion.div
      custom={5}
      initial="hidden"
      animate="visible"
      variants={menuItemVariants}
    >
      <div
        className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-md ${
          activeUser?.user?.balance >= 0
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        <span>
          {activeUser?.user?.balance >= 0 ? "Balance" : "Balance Due"}
        </span>
        <span>
          {isLoading ? (
            <span className="inline-block h-3 w-10 bg-gray-200 rounded animate-pulse" />
          ) : (
            formatCurrency(Math.abs(activeUser?.user?.balance), "GHS")
          )}
        </span>
      </div>
    </motion.div>
  )

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-label="User menu"
        >
          {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Avatar className="h-10 w-10 rounded-full border-2  border-white shadow-sm hover:ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-primary transition-all">
                <AvatarImage src={user?.image} alt={user?.name || "User"} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 p-2 shadow-lg rounded-xl border border-gray-100 bg-white"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {user?.name || "Account"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-gray-100" />
          </motion.div>

          <div className="space-y-1">
            {renderMenuItem(
              () => router.push("/account/profile"),
              "My Profile",
              <User size={16} />,
              0
            )}

            {renderMenuItem(
              () => router.push("/account/order-history"),
              "Order History",
              <ShoppingBag size={16} />,
              1
            )}

            {renderMenuItem(
              () => router.push("/account/wishlist"),
              "My Wishlist",
              <Heart size={16} />,
              2
            )}

            {user.role === "admin" &&
              renderMenuItem(
                () => router.push("/admin/dashboard"),
                "Admin Dashboard",
                <LayoutDashboard size={16} />,
                3,
                true
              )}

            {renderBalance()}

            <DropdownMenuSeparator className="my-1 bg-gray-100" />

            {renderMenuItem(handleLogout, "Sign Out", <LogOut size={16} />, 4)}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status indicator */}
      {!isLoading && (
        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>
  )
}

export default React.memo(UserButton)
