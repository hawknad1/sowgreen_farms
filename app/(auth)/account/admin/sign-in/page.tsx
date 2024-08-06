import SignInForm from "@/components/forms/SignInForm"
import { GoogleAuth } from "@/components/social-auths/GoogleAuth"
import Image from "next/image"
import React from "react"

const SignIn = () => {
  return (
    <div className="flex flex-col justify-center items-center p-8">
      <div className=" flex items-center justify-center mb-2">
        <Image
          src="/images/sowgreen.png"
          alt="Sowgreen Logo"
          height={100}
          width={100}
          className="object-contain"
        />
      </div>
      <div className="border border-neutral-400 rounded-lg p-4 flex flex-col gap-4 w-full sm:max-w-[400px] md:max-w-[450px] shadow-sm">
        <div className="max-w-xs">
          <h3 className="text-2xl font-bold ">Sign In</h3>
          <p className="text-neutral-400 text-sm">
            Enter your details below to shop amazing fresh farm produce!
          </p>
        </div>

        <SignInForm />

        {/* <div className="flex flex-col gap-2 mt-2">
          <span className="flex items-center">
            <span className="h-px flex-1 bg-black"></span>
            <span className="shrink-0 px-6 text-gray-600">OR</span>
            <span className="h-px flex-1 bg-black"></span>
          </span>
          <GoogleAuth />
        </div> */}
        <p className="text-sm text-neutral-600 mt-2">
          Don't have an account?{" "}
          <a href="/sign-up" className="hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignIn
