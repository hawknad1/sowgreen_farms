import prisma from "@/lib/prismadb"
import { TaxService } from "@/lib/serviceCharge"
// import { applyTaxToProducts } from "@/lib/serviceCharge"
import { Product } from "@/types"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          include: {
            partner: true,
          },
        },
      },
    })
    // const appliedTax = applyTaxToProducts(categories as unknown as any[])

    const productsWithTax = await TaxService.applyTaxToProducts(
      categories as unknown as any[]
    )

    const response = NextResponse.json(productsWithTax, { status: 200 })
    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://sowgreen-farms.vercel.app"
    )
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")

    return response
  } catch (error) {
    return NextResponse.json(
      { message: "couldnt fetch categories" },
      { status: 500 }
    )
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     const categories = await prisma.category.findMany({
//       include: {
//         products: {
//           include: {
//             partner: true,
//             variants: true,
//           },
//         },
//       },
//     })

//     // Extract and flatten all products from all categories
//     const allProducts = categories.flatMap((category) => category.products)

//     // Apply tax to all products
//     const productsWithTax = applyTaxToProducts(
//       allProducts as unknown as Product[]
//     )

//     const response = NextResponse.json(productsWithTax, { status: 200 })
//     response.headers.set(
//       "Access-Control-Allow-Origin",
//       "https://sowgreen-farms.vercel.app"
//     )
//     response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")

//     return response
//   } catch (error) {
//     console.error("Error fetching categories:", error)
//     return NextResponse.json(
//       { message: "Couldn't fetch categories" },
//       { status: 500 }
//     )
//   }
// }

export async function POST(req: NextRequest) {
  const { categoryName, imageUrl, link } = await req.json()
  try {
    if (!categoryName) {
      return NextResponse.json({ message: "category name is required!" })
    }
    const newCategory = await prisma.category.create({
      data: {
        categoryName,
        imageUrl,
        link,
      },
      include: { products: true },
    })
    return NextResponse.json(newCategory)
  } catch (error) {
    return NextResponse.json({ message: "Couldnt create new category" })
  }
}
