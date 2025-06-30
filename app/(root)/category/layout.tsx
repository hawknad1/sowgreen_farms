import { Metadata } from "next"

// app/products/layout.tsx
export const metadata: Metadata = {
  title: "All Categories",
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
