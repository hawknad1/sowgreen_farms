// src/components/Providers.tsx
"use client" // Mark this file as a Client Component

import { SessionProvider } from "next-auth/react"
import { BalanceProvider } from "@/context/BalanceContext"
import { Toaster } from "react-hot-toast"

export const Providers = ({
  children,
  session,
}: {
  children: React.ReactNode
  session: any
}) => {
  return (
    <SessionProvider
      session={session}
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      <BalanceProvider>
        {children}
        <Toaster position="bottom-right" />
      </BalanceProvider>
    </SessionProvider>
  )
}
