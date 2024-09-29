"use client"

import Image from "next/image"
import React from "react"
import MenuBar from "./MenuBar"
import SideSheet from "./SideSheet"
import Link from "next/link"
import UserAvatar from "../UserAvatar"

import { Button } from "../ui/button"
import SearchBarInput from "./SearchBarInput"
import { useRouter } from "next/navigation"
import { ShoppingCartIcon } from "lucide-react"

const Header = () => {
  const router = useRouter()

  return (
    <div className="flex items-center mx-auto p-2 justify-between px-4 gap-2">
      <Link href="/" className="">
        <Image
          src="/images/sowgreen.png"
          alt="logo"
          width={80}
          height={80}
          className="object-contain w-16 md:w-24 "
        />
      </Link>

      <SearchBarInput />

      <div className=" flex items-center ">
        <div className="hidden lg:flex">
          <MenuBar />
        </div>
        <div className="md:flex md:items-center md:gap-12">
          <nav aria-label="Global" className="hidden md:block"></nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-4 md:space-x-6">
              <div onClick={() => router.push("/signin")}>
                <Button className="hidden md:inline-flex">Sign In</Button>
              </div>
              <div
                onClick={() => router.push("/basket")}
                className="p-2 h-10 w-10 flex items-center justify-center rounded-full cursor-pointer bg-accent"
              >
                <ShoppingCartIcon className="size-5 " />
              </div>

              <SideSheet />
            </div>
          </div>
        </div>
      </div>
      <UserAvatar />
    </div>
  )
}

export default Header
