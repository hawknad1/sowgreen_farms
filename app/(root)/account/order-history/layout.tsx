import { Metadata } from "next"

// app/products/layout.tsx
export const metadata: Metadata = {
  title: "Order History",
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
