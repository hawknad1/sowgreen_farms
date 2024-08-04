import { login } from "@/actions/auth"
import Image from "next/image"
import React from "react"

const GoogleSignIn = () => {
  return (
    <div
      onClick={() => login("google")}
      className="flex items-center gap-3 justify-center border border-slate-300  
    rounded-md p-1.5 cursor-pointer hover:bg-slate-300"
    >
      <Image
        src="/images/google.png"
        alt="Google"
        width={25}
        height={25}
        className="object-contain"
      />
      <p className="font-semibold">Continue with Google</p>
    </div>
  )
}

export default GoogleSignIn
