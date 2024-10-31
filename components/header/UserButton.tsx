"use client"
import React from "react"
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
}

const UserButton = ({ user }: { user: UserProps }) => {
  const router = useRouter()
  const initials = getInitials(user?.name)

  return (
    <div className="cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={user?.image} alt={user?.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        {user.role === "admin" ? (
          <DropdownMenuContent className="outline-none focus-visible:ring-0 ring-0 w-44">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/account/order-history")}
              className="text-sm focus:bg-accent focus:text-accent-foreground"
            >
              Order History
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/admin/dashboard")}
              className="text-base focus:bg-accent focus:text-accent-foreground"
            >
              Admin Dashboard
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => logout()}
              className="text-red-500 flex gap-2.5 text-base hover:bg-red-500/10"
            >
              <LogOut size={16} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent className="outline-none focus-visible:ring-0 ring-0 w-44">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/account/order-history")}
              className="text-sm focus:bg-accent focus:text-accent-foreground"
            >
              Order History
            </DropdownMenuItem>
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
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-red-500 flex gap-2.5 text-sm hover:bg-red-500/10"
            >
              <LogOut size={16} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}

export default UserButton
