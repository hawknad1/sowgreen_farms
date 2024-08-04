"use client"

import SignInForm from "@/components/forms/SignInForm"
import { GoogleAuth } from "@/components/social-auths/GoogleAuth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import React from "react"

const SingInInterception = () => {
  const router = useRouter()

  function onDismiss() {
    router.back()
  }
  return (
    <Dialog
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onDismiss()
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Sign in to get access to all features
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <SignInForm />
        </div>
        <span className="flex items-center">
          <span className="h-px flex-1 bg-black"></span>
          <span className="shrink-0 px-6 text-gray-600">OR</span>
          <span className="h-px flex-1 bg-black"></span>
        </span>
        <DialogFooter>
          <GoogleAuth />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SingInInterception
