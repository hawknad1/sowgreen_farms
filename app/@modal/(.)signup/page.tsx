"use client";

import SignUpForm from "@/components/forms/SignUpForm";
import GoogleSignUp from "@/components/social-auths/GoogleSignUp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import React from "react";

const SignupInterception = () => {
  const router = useRouter();

  function onDismiss() {
    router.back();
  }
  return (
    <Dialog
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onDismiss();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Sign up</DialogTitle>
          <DialogDescription>
            Create account now to get 10% discount!
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <SignUpForm />
          <span className="flex items-center">
            <span className="h-px flex-1 bg-black"></span>
            <span className="shrink-0 px-6 text-gray-300">OR</span>
            <span className="h-px flex-1 bg-black"></span>
          </span>
          <GoogleSignUp />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupInterception;