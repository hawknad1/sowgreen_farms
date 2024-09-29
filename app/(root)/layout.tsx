import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navbar from "@/components/header/Navbar"
import Footer from "@/components/footer/Footer"
import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sowgreen Farms",
  description: "Get your organic farm produce",
}

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="en">
      <SessionProvider>
        <body className={inter.className}>
          <header className="border-b sticky top-0 z-50 bg-white w-full">
            <Navbar />
          </header>
          <div>
            {children}
            {/* {modal} */}
          </div>
          <Footer />
        </body>
      </SessionProvider>
    </html>
  )
}
