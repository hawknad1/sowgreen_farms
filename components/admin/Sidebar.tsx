"use client"

import { sidebarLinks } from "@/constants"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "../app-sidebar"
import { useSession } from "next-auth/react"

interface SidebarProps {
  children?: React.ReactNode
}

const Sidebar = ({ children }: SidebarProps) => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user

  // Find active main and sub-navigation items
  const { activeMain, activeSub } = getActiveNav(pathname)

  const fullName = user?.name
  const firstName = fullName?.split(" ")[0] // Get the first name
  const capitalizedFirstName =
    firstName?.charAt(0).toUpperCase() + firstName.slice(1) // Capitalize first letter

  console.log(capitalizedFirstName) // Output: James

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between w-full px-4  bg-white  shadow-sm">
          <div className=" flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                {activeMain && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={activeMain.url}>
                        {activeMain.title}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {activeSub && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>{activeSub.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    )}
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <p>
            {` 👋🏾 Welcome,`}{" "}
            <span className="font-semibold">{capitalizedFirstName}</span>!
          </p>
        </header>

        {/* Scrollable Content */}
        <main className="h-[calc(100%-4rem)] overflow-y-auto scrollbar-hide">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

// Helper function to find the active navigation item
const getActiveNav = (pathname: string) => {
  let activeMain: { title: string; url: string; items?: any[] } | null = null
  let activeSub: { title: string; url: string } | null = null

  for (const mainItem of sidebarLinks.navMain) {
    // Check if the main item is active
    if (pathname.startsWith(mainItem.url)) {
      activeMain = mainItem

      // Check for active sub-items
      if (mainItem.items) {
        activeSub = mainItem.items.find((subItem) => pathname === subItem.url)
      }
      break
    }
  }

  return { activeMain, activeSub }
}

export default Sidebar
