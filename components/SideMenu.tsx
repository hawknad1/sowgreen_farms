"use client"

import { getAdminSideMenuLinks, getSideMenuLinks } from "@/constants"
import { getUser } from "@/lib/actions/getUser"
import { useUserStore } from "@/store"
import { MenuItem } from "@/types"
import { useSession } from "next-auth/react"
import Link from "next/link"
import React, { useEffect, useState } from "react"

interface UserData {
  user: {
    id: string
    name?: string
    email?: string
    balance?: number
    role: string
    image?: string | null
    createdAt: string
    updatedAt: string
    emailVerified?: string | null
    phone?: string | null
  }
}

// Define the type for menu items with nested structure
const SideMenu = () => {
  const { data: session } = useSession()
  const { user: activeUser } = useUserStore()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const user = session?.user

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.email) return

      setLoading(true) // Start loading

      const data = await getUser(user.email)
      if (data) setUserData(data)

      setLoading(false) // Done loading
    }

    fetchUser()
  }, [user?.email])

  if (!user) return null // Avoid rendering if user is not available.

  const links: MenuItem[] =
    user.role === "admin"
      ? getAdminSideMenuLinks(activeUser?.user?.balance || 0)
      : getSideMenuLinks(activeUser?.user?.balance || 0)

  return (
    <div className="flow-root mt-6">
      <ul className="-my-2 divide-y divide-gray-100">
        {links.map((menu, index) => (
          <li key={index} className="py-2">
            {menu.items ? (
              <CollapsibleSection
                label={menu.label}
                icon={menu.icon}
                items={menu.items}
              />
            ) : menu.label.includes("Credit Balance") ? (
              loading ? (
                <span className="flex items-center gap-x-2 text-sm text-gray-400 px-4 py-2 animate-pulse">
                  {menu.icon && <menu.icon className="h-4 w-4" />}
                  Loading balance...
                </span>
              ) : (
                <Link
                  href={menu.href || "#"}
                  className={`flex items-center gap-x-2 text-sm font-medium rounded-lg px-4 py-2 hover:bg-gray-100 ${
                    userData?.user?.balance >= 0
                      ? "bg-green-50 text-green-700 hover:text-green-700"
                      : "bg-red-50 text-red-700 hover:text-red-700"
                  }`}
                >
                  {menu.icon && <menu.icon className="h-4 w-4" />}
                  {menu.label}
                </Link>
              )
            ) : (
              <Link
                href={menu.href || "#"}
                className="flex items-center gap-x-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg px-4 py-2 font-medium"
              >
                {menu.icon && <menu.icon className="h-4 w-4" />}
                {menu.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

// CollapsibleSection Component
const CollapsibleSection = ({ label, icon: ParentIcon, items }: MenuItem) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div>
      {/* Parent Label with Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <span className="flex items-center gap-x-2">
          {ParentIcon && <ParentIcon className="h-4 w-4" />}
          {label}
        </span>
        {/* Chevron Icon for Expand/Collapse */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 transition-transform duration-300 transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Nested Items */}
      {isExpanded && (
        <ul className="space-y-1 pl-4">
          {items?.map((item, itemIndex) => (
            <Link
              key={itemIndex}
              href={item.href || "#"}
              className="flex items-center gap-x-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              {/* Use sub-item's icon if available, otherwise use parent's icon */}
              {item.icon ? (
                <item.icon className="h-4 w-4" />
              ) : ParentIcon ? (
                <ParentIcon className="h-4 w-4" />
              ) : null}
              {item.label}
            </Link>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SideMenu
