"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"

const SowgreenAdminLogo = () => {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push("/")}
      className="flex border cursor-pointer"
    >
      <div className="flex aspect-square size-14 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/images/sowgreen.png" alt="logo" height={65} width={65} />
        </Link>
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">Sowgreen Organic</span>
        <span className="truncate text-xs">Farms</span>
      </div>
    </div>
  )
}

export default SowgreenAdminLogo
