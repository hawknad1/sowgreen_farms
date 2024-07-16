import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sowgreen Farms",
  description: "Get your organic farm produce",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b sticky top-0 z-50 bg-white">
          <Navbar />
        </header>
        <div>
          {children}
          {modal}
        </div>
        <Footer />
      </body>
    </html>
  );
}
