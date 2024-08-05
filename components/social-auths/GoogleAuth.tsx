"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { login } from "@/lib/actions/auth"

export const GoogleAuth = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full flex items-center gap-x-2"
        variant="outline"
        onClick={() => login("google")}
      >
        <FcGoogle className="h-5 w-5" />
        Continue with Google
      </Button>
    </div>
  )
}
