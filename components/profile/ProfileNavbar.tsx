import React from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Home, LogOut, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface ProfileNavbarProps {
  user: {
    name: string
    avatar?: string
  }
}

const ProfileNavbar = ({ user }: ProfileNavbarProps) => {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-green-600 text-2xl">🥑</span>
            <span className="font-bold text-xl">FreshGrocer</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <div className="bg-green-100 h-full w-full flex items-center justify-center text-sm font-semibold text-green-600">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
              </Avatar>
              <span className="text-sm font-medium hidden md:block">
                {user.name}
              </span>
            </div>

            <Button variant="ghost" size="icon" className="text-gray-500">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default ProfileNavbar
