"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu className="gap-y-3">
        {items.map((item) => {
          // Check if the main link or any of its nested links are active
          const isActiveMain =
            pathname === item.url ||
            item.items?.some((subItem) => pathname === subItem.url)
          const isActiveSub = item.items?.some(
            (subItem) => pathname === subItem.url
          )

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActiveMain} // Expand if the parent or any sub-item is active
            >
              <SidebarMenuItem>
                {/* Main Link */}
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={
                    isActiveMain && !item.items
                      ? "bg-gray-200"
                      : isActiveMain
                      ? "bg-gray-100" // Highlight parent if sub-links are active
                      : "hover:bg-gray-100"
                  }
                >
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>

                {/* Nested Links */}
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          const isActiveSubItem = pathname === subItem.url

                          return (
                            <SidebarMenuSubItem
                              key={subItem.title}
                              className={
                                isActiveSubItem
                                  ? "bg-gray-200/65 rounded-sm" // Highlight the active sub-link
                                  : "hover:bg-gray-100"
                              }
                            >
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
