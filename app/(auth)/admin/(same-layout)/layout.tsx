import "@/app/globals.css"
import Header from "@/components/admin/Header"
import Sidebar from "@/components/admin/Sidebar"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <Sidebar>{children}</Sidebar>
}
