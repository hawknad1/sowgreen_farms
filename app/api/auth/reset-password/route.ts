import prisma from "@/lib/prismadb"
import { verifyPasswordResetToken } from "@/lib/tokens"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { token, password } = await request.json()

  try {
    // Verify token
    const verifiedToken = await verifyPasswordResetToken(token)

    if (!verifiedToken) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await hash(password, 10)

    // Update user hashedPassword
    await prisma.user.update({
      where: { email: verifiedToken.email },
      data: {
        hashedPassword: hashedPassword,
      },
    })

    // Delete all reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { email: verifiedToken.email },
    })

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
