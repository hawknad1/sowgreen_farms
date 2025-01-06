import type { Metadata } from "next"
import { Inter, Jost, Poppins, Roboto } from "next/font/google"
import Navbar from "@/components/header/Navbar"
import Footer from "@/components/footer/Footer"
import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"
import "../globals.css"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })
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
        <body className={jost.className}>
          <header className="border-b sticky top-0 z-50 bg-white w-full">
            <Navbar />
          </header>
          <div>
            {children}
            {/* {modal} */}
            <Toaster />
          </div>
          <Footer />
        </body>
      </SessionProvider>
    </html>
  )
}
