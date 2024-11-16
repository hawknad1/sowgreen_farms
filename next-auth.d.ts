// next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string
      email?: string
      role?: string
      balance?: number // Include balance here
    }
  }

  interface User {
    id: string
    name?: string
    email?: string
    role?: string
    balance?: number
  }

  interface JWT {
    id: string
    role: string // Add role field to the JWT type
    balance: number // Add balance field to the JWT type
  }
}
