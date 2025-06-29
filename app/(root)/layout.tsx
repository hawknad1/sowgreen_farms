import type { Metadata } from "next"
import { Inter, Jost, Poppins, Roboto } from "next/font/google"
import Navbar from "@/components/header/Navbar"
import Footer from "@/components/footer/Footer"
import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"
import "../globals.css"
import { Toaster } from "react-hot-toast"
// import { Toaster as Sonner } from "@/components/ui/sonner"
// import { Toaster } from "@/components/ui/sonner"
import { BalanceProvider } from "@/context/BalanceContext"
import { Providers } from "@/components/Providers"

// Define fonts
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
})
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jost",
})

// Metadata for the site
export const metadata: Metadata = {
  title: {
    default: "Sowgreen Organic Farms",
    template: "%s | Sowgreen Organic Farms",
  },
  description: "Get your organic farm produce delivered to your doorstep.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" className={`${jost.variable} `}>
      <SessionProvider
        session={session}
        refetchInterval={5 * 60}
        refetchOnWindowFocus={true}
      >
        <body className="min-h-screen flex flex-col">
          <BalanceProvider>
            {/* Sticky Navbar */}
            <header className="sticky top-0 z-50 bg-white w-full shadow-sm border-b">
              <Navbar />
            </header>
            {/* Main Content */}
            <main className="flex-1">{children}</main>
            {/* Toaster Notifications */}
            <Toaster />
            {/* <Sonner position="bottom-right" /> */}

            {/* Footer */}
            <Footer />
          </BalanceProvider>
        </body>
      </SessionProvider>
    </html>
  )
}
