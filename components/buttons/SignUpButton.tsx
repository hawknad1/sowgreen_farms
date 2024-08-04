"use client"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

const SignUpButton = () => {
  const router = useRouter()
  return (
    <div>
      <Button
        onClick={() => router.push("/sign-up")}
        className="rounded-full px-6"
      >
        Sign Up
      </Button>
    </div>
  )
}

export default SignUpButton
