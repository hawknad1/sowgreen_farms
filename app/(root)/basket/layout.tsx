import { Metadata } from "next"

// app/products/layout.tsx
export const metadata: Metadata = {
  title: "Basket",
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
