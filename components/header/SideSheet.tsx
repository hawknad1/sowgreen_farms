"use client"
import React, { useState, useEffect } from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { Bars3BottomRightIcon } from "@heroicons/react/24/outline"
import { Button } from "../ui/button"
import SideMenu from "../SideMenu"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation" // Import usePathname
import { signOut } from "next-auth/react"

const SideSheet = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname() // Use usePathname to track the current route
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const user = session?.user

  // Function to handle logout
  const handleLogout = async () => {
    await signOut()
    router.push("/sign-in")
  }

  // Close the sheet when the route changes
  useEffect(() => {
    setIsSheetOpen(false) // Close the sheet whenever the pathname changes
  }, [pathname])

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <button
          className="p-2 bg-white rounded-full lg:hidden cursor-pointer"
          onClick={() => setIsSheetOpen(true)} // Open the sheet when the button is clicked
        >
          <Bars3BottomRightIcon className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <SideMenu />
        <SheetFooter className="mt-8">
          <SheetClose asChild>
            {user ? (
              <Button
                onClick={handleLogout}
                className="w-full bg-sowgren_Color text-white hover:bg-sowgren_Color/85"
              >
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => router.push("/sign-in")}>Log In</Button>
            )}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default SideSheet
