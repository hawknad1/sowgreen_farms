"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Bell,
  CircleUser,
  Home,
  LogOut,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import Link from "next/link"
import Image from "next/image"
import { sidebarLinks } from "@/constants"
import { usePathname } from "next/navigation"

const Sidebar = () => {
  const pathname = usePathname()
  return (
    <div className="hidden border-r bg-white md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image
              src="/images/sowgreen.png"
              alt="logo"
              height={65}
              width={65}
            />
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 lg:gap-y-1.5">
            {sidebarLinks.map(({ label, path, icon: Icon }) => {
              const isActive =
                (pathname.includes(path) && path.length > 1) ||
                pathname === path
              return (
                <Link
                  key={label}
                  href={path}
                  className={`${
                    isActive && "bg-muted"
                  } flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button className="w-full flex gap-x-2 font-medium">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
