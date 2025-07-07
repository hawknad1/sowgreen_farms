import { v4 as uuidv4 } from "uuid"
import { addHours } from "date-fns"
import prisma from "./prismadb"

export const generatePasswordResetToken = async (email: string) => {
  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  })

  // Create new token
  const token = uuidv4()
  const expires = addHours(new Date(), 2) // Token expires in 2 hours

  const createdToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  return createdToken
}

export const verifyPasswordResetToken = async (token: string) => {
  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!existingToken) return null

  // Check if token has expired
  if (new Date(existingToken.expires) < new Date()) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    })
    return null
  }

  return existingToken
}
