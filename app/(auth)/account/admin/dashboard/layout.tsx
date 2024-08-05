import "@/app/globals.css"
import Header from "@/components/admin/Header"
import Sidebar from "@/components/admin/Sidebar"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="">
      <div className="flex flex-col gap-y-4">
        <Header />
        <main className="container mx-auto">{children}</main>
      </div>
    </div>
  )
}
