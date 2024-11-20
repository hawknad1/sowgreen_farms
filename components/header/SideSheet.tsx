"use client"
import React from "react"
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
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

const SideSheet = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user

  const handleLogout = async () => {
    await signOut()
    router.push("/sign-in")
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 bg-white rounded-full lg:hidden cursor-pointer">
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
              <Button onClick={handleLogout}>Sign Out</Button>
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
