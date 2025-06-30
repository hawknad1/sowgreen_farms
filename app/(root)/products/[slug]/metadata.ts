// // metadata.ts
// import { Metadata } from "next"
// import { Product } from "@/types"

// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string }
// }): Promise<Metadata> {
//   const product = await fetch(`/api/products/${params.slug}`, {
//     method: "GET",
//     cache: "no-store",
//   }).then((res) => res.json())

//   return {
//     title: `${product.title} | Sowgreen Organic Farms`,
//     description: product.description,
//     openGraph: {
//       title: product.title,
//       description: product.description,
//       //   images: product.images.map(img => ({ url: img.url })),
//     },
//   }
// }

// app/(root)/products/[slug]/metadata.ts
import { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const product = await fetch(`/api/products/${params.slug}`).then((res) =>
    res.json()
  )

  return {
    title: `${product.title} | Sowgreen Organic Farms`,
    description: product.description,
  }
}
