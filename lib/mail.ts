import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${baseUrl}/reset-password?token=${token}`

  try {
    await resend.emails.send({
      from: "tech@zoroastique.com",
      to: email,
      subject: "Reset your password",
      html: `
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 2 hours.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}
