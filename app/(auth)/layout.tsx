import type { Metadata } from "next"
import { Inter, Jost } from "next/font/google"
import ".././globals.css"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import { Providers } from "@/components/Providers"

const inter = Inter({ subsets: ["latin"] })

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jost",
})

export const metadata: Metadata = {
  title: "Sowgreen Farms",
  description: "Get your organic farm produce",
  viewport: "width=device-width, initial-scale=1.0",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body>
          <div className={jost.className}>{children}</div>
        </body>
      </SessionProvider>
    </html>
    // <html lang="en">
    //   <body>
    //     <Providers session={session}>
    //       <div className={jost.className}>{children}</div>
    //     </Providers>
    //   </body>
    // </html>
  )
}
