"use client"
import React from "react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

const SignInButton = () => {
  const router = useRouter()
  return (
    <Button
      variant="outline"
      onClick={() => router.push("/sign-in")}
      className="border-none px-6 text-sm rounded-full"
    >
      Sign In
    </Button>
  )
}

export default SignInButton
