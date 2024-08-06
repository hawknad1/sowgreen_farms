import "../../../../globals.css"
import Sidebar from "@/components/admin/Sidebar"
import { Toaster } from "react-hot-toast"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />

      <div className="flex flex-col gap-y-4">
        <Toaster position="top-center" />
        <main className="container mx-auto">{children}</main>
      </div>
    </div>
  )
}
