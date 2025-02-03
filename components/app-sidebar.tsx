"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

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
import { NavProjects } from "./nav-projects"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { sidebarLinks } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
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
                <div className="flex flex-1 aspect-square size-16 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
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
                <div className="grid  text-left text-sm leading-tight">
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
      <SidebarFooter>{/* <AdminAvatar /> */}</SidebarFooter>
    </Sidebar>
  )
}
