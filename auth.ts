import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prismadb"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    logo: "/images/sowgreen.png",
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
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
            email: credentials?.email as string,
          },
        })

        if (!existingUser) {
          return null
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          existingUser?.hashedPassword
        )

        if (!passwordMatch) {
          return null
        }

        return {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
})
