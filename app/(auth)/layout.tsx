import type { Metadata } from "next"
import { Inter, Jost } from "next/font/google"
import ".././globals.css"

const inter = Inter({ subsets: ["latin"] })

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jost",
})

export const metadata: Metadata = {
  title: "Sowgreen Farms",
  description: "Get your organic farm produce",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className={jost.className}>{children}</div>
      </body>
    </html>
  )
}
