import React from "react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { Bars3BottomRightIcon } from "@heroicons/react/24/outline"
import { Button } from "../ui/button"
import { menuLinks } from "@/constants"
import Link from "next/link"
import SideMenu from "../SideMenu"
import { logout } from "@/lib/actions/auth"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const SideSheet = () => {
  const session = useSession()
  const router = useRouter()
  const user = session?.data?.user

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 bg-white rounded-full lg:hidden cursor-pointer">
          <Bars3BottomRightIcon className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SideMenu />
        <SheetFooter className="mt-8">
          <SheetClose asChild>
            {user ? (
              <Button onClick={() => logout()}>Sign Out</Button>
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
