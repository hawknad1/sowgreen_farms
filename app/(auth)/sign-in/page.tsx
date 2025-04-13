import SignInForm from "@/components/forms/SignInForm"
import { GoogleAuth } from "@/components/social-auths/GoogleAuth"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const SignIn = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-gray-50">
      {/* Logo Section */}
      <div className="flex items-center justify-center">
        <Image
          src="/images/logo.png"
          alt="Sowgreen Logo"
          height={100}
          width={100}
          className="object-contain h-fit w-48"
          priority // Ensures the logo loads quickly
        />
      </div>

      {/* Sign In Card */}
      <div className="border border-neutral-300 rounded-lg p-6 sm:p-8 flex flex-col gap-6 w-full sm:max-w-[400px] md:max-w-[450px] bg-white shadow-lg">
        {/* Heading and Description */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
          <p className="text-neutral-500 text-sm mt-2">
            Enter your details below to shop amazing fresh farm produce!
          </p>
        </div>

        {/* Sign In Form */}
        <SignInForm />

        {/* Divider */}
        <div className="flex items-center">
          <span className="h-px flex-1 bg-neutral-300"></span>
          <span className="shrink-0 px-4 text-sm text-neutral-500">OR</span>
          <span className="h-px flex-1 bg-neutral-300"></span>
        </div>

        {/* Google Auth */}
        <div className="flex justify-center">
          <GoogleAuth />
        </div>

        {/* Sign Up Link */}
        <p className="text-sm text-neutral-600 text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-teal-600 hover:text-teal-700 hover:underline transition-colors duration-200"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
