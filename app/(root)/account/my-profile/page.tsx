"use client"
import { useSession } from "next-auth/react"
import React from "react"

interface UserProps {
  name: string
  role: string
}

const MyProfilePage = () => {
  const session = useSession()
  const user = session?.data?.user as UserProps
  const name = user.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")

  return (
    <div className="h-screen container mx-auto flex justify-center items-center">
      <div>
        <h2 className="text-4xl font-bold">{`Hi, ${name}`}</h2>
      </div>
    </div>
  )
}

export default MyProfilePage
