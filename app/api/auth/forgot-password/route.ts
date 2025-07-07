import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"
import { generatePasswordResetToken } from "@/lib/tokens"
import { sendPasswordResetEmail } from "@/lib/mail"

export async function POST(request: Request) {
  const { email } = await request.json()

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { message: "If this email exists, you'll receive a reset link" },
        { status: 200 }
      )
    }

    // Generate token and send email
    const { token, expires } = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(email, token)

    return NextResponse.json(
      { message: "Password reset email sent" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
