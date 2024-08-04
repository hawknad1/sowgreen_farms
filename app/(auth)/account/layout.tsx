import "../../globals.css"
import Header from "./admin/Header"
import Sidebar from "./admin/Sidebar"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />

      <div className="flex flex-col gap-y-4">
        <Header />
        <main className="container mx-auto">{children}</main>
      </div>
    </div>
  )
}
