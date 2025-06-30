import { Metadata } from "next"

// app/products/layout.tsx
export const metadata: Metadata = {
  title: "Confirm Order",
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
