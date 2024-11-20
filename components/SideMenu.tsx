"use client"
import { adminSideMenuLinks, sideMenuLinks } from "@/constants"
import { CircleHelp, Settings } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import React from "react"

const SideMenu = () => {
  const { data: session } = useSession()
  const user = session?.user

  if (!user) return null // Avoid rendering if user is not available.

  return (
    <div className="flow-root">
      <ul className="-my-2 divide-y divide-gray-100">
        <li className="py-2">
          <ul className="space-y-1 mt-4">
            {(user.role === "admin" ? adminSideMenuLinks : sideMenuLinks).map(
              ({ label, href, icon: Icon }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="flex items-center gap-x-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              )
            )}
          </ul>
        </li>
        <li className="py-2">
          <ul className="space-y-1">
            <Link
              href="/help"
              className="flex items-center gap-x-2  rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <CircleHelp className="h-4 w-4" />
              Help
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-x-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default SideMenu
