// next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role: string // Add the role field to the User type
  }

  interface Session {
    user: {
      role: string // Add the role field to the session user type
    }
  }

  interface JWT {
    role: string // Add role field to the JWT type
  }
}
