import "../../../../globals.css"
import Sidebar from "@/components/admin/Sidebar"
import { Toaster } from "react-hot-toast"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="">
      <div className="flex flex-col gap-y-4">
        <Toaster position="top-center" />

        <main className="container mx-auto">{children}</main>
      </div>
    </div>
  )
}
