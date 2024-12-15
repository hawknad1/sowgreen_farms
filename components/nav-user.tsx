"use client"

import { useEffect, useState } from "react"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useSession, signOut } from "next-auth/react"
import getInitials from "@/lib/getInitials"

interface UserProps {
  name?: string
  email?: string
  role?: string
  emailVerified?: string
  image?: string
  balance?: number
}

export function NavUser({ user }: { user: UserProps }) {
  const [activeUser, setActiveUser] = useState<UserProps | null>(null)
  const { isMobile } = useSidebar()

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.email) return
      try {
        const response = await fetch(`/api/user/${user.email}`, {
          method: "GET",
          cache: "no-store",
        })
        if (!response.ok) throw new Error("Failed to fetch user details")
        const data = await response.json()
        setActiveUser(data)
      } catch (error) {
        console.error("Error fetching user details:", error)
      }
    }

    fetchUserDetails()
  }, [user?.email])

  const displayUser = activeUser || user
  const initials = getInitials(displayUser?.name || "")

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={displayUser?.image} alt={displayUser?.name} />
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {displayUser?.name || "Guest"}
                </span>
                <span className="truncate text-xs">
                  {displayUser?.email || "No Email"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2 px-1 py-1.5">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={displayUser?.image}
                    alt={displayUser?.name}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="block font-semibold">
                    {displayUser?.name}
                  </span>
                  <span className="block text-xs">{displayUser?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles className="mr-2" /> Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="mr-2" /> Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2" /> Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2" /> Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
