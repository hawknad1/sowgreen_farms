import "@/app/globals.css"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <main className="container mx-auto">{children}</main>
    </div>
  )
}
