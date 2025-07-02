import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prismadb"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import authConfig from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  theme: {
    logo: "/images/sowgreen.png",
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // Use JWT for session management
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Kwaku Dankwah" },
        email: {
          label: "Email",
          type: "email",
          placeholder: "kwaku@yahoo.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        })

        if (!existingUser) {
          return null
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          existingUser.hashedPassword
        )

        if (!passwordMatch) {
          return null
        }

        // Return user with role included
        return {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          balance: existingUser.balance,
          role: existingUser.role, // Include role here
        }
      },
    }),
    Google,
  ],
  useSecureCookies: process.env.NODE_ENV === "production",
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      // When user logs in, add the role to the token
      if (user) {
        token.role = user.role as string // Explicitly cast the role to string
        token.balance = user.balance
        token.id = user.id as string
      }
      return token
    },
    async session({ session, token }) {
      // Add role from the token to the session

      session.user.role = token.role as string // Explicitly cast the role to string
      session.user.balance = token.balance as number // Explicitly cast the role to string
      session.user.id = token.id as string

      return session
    },
  },
})
