import "@/app/globals.css"
import Header from "@/components/admin/Header"
import Sidebar from "@/components/admin/Sidebar"
import { Metadata } from "next"
import { Jost } from "next/font/google"
import { Toaster } from "react-hot-toast"

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jost",
})

export const metadata: Metadata = {
  title: "Admin | Sowgreen Farms",
  description: "Get your organic farm produce",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Sidebar>
      <div className={jost.className}>{children}</div>
      <Toaster />
    </Sidebar>
  )
}
