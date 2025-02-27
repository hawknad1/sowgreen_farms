"use client"
import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { sidebarLinks } from "@/constants"
import { useRouter } from "next/navigation"
import { NavUser } from "./nav-user"
import { useSession } from "next-auth/react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div
                onClick={() => router.push("/")}
                className="flex border cursor-pointer"
              >
                <div className="flex flex-1 aspect-square size-16 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold"
                  >
                    <Image
                      src="/images/logo.png"
                      alt="logo"
                      height={80}
                      width={80}
                      className="w-24"
                    />
                  </Link>
                </div>
                <div className="grid text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Sowgreen Organic
                  </span>
                  <span className="truncate text-xs">Farms</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarLinks.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={sidebarLinks.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
