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
import { logout } from "@/actions/auth"

interface UserProps {
  name?: string
  email?: string
  emailVerified?: string
  image?: string
}

const UserButton = ({ user }: { user: UserProps }) => {
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
        <DropdownMenuContent className="outline-none focus-visible:ring-0 ring-0">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Account</DropdownMenuItem>
          <DropdownMenuItem>Orders</DropdownMenuItem>
          <DropdownMenuItem>Watchlist</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserButton
