import prisma from "@/lib/prismadb"
import { TaxService } from "@/lib/serviceCharge"
// import { applyTaxToProducts } from "@/lib/serviceCharge"
import { Product } from "@/types"
import { NextRequest, NextResponse } from "next/server"

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { categoryName: string } }
// ) {
//   try {
//     const catName = params.categoryName
//     const category = await prisma.category.findMany({
//       where: { categoryName: catName },
//       include: {
//         products: { include: { variants: true, partner: true } },
//       },
//     })
//     const response = NextResponse.json(category)
//     response.headers.set(
//       "Access-Control-Allow-Origin",
//       "https://sowgreen-farms.vercel.app"
//     )
//     response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
//     return response
//   } catch (error) {
//     return NextResponse.json({ message: "couldnt fetch category!" })
//   }
// }

export async function GET(
  req: NextRequest,
  { params }: { params: { categoryName: string } }
) {
  try {
    const catName = params.categoryName
    const category = await prisma.category.findMany({
      where: { categoryName: catName },
      include: {
        products: {
          include: {
            variants: true,
            partner: true,
          },
        },
      },
    })

    // const productsWithTax = await TaxService.applyTaxToProducts(products)

    // Apply tax to products within each category
    const categoryWithTaxedProducts = category.map((cat) => ({
      ...cat,
      // products: applyTaxToProducts(cat.products as unknown as Product[]),
      products: TaxService.applyTaxToProducts(
        cat.products as unknown as Product[]
      ),
    }))

    const response = NextResponse.json(categoryWithTaxedProducts)
    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://sowgreen-farms.vercel.app"
    )
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
    return response
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { message: "Couldn't fetch category!" },
      { status: 500 }
    )
  }
}

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { title, description, price, image, categoryName } = await req.json()
//   const id = params.id
//   try {
//     const product = await prisma.product.update({
//       where: { id },
//       data: {
//         title,
//         categoryName,
//         description,
//         image,
//         price,
//       },
//     })
//     return NextResponse.json(product)
//   } catch (error) {
//     return NextResponse.json({ message: "Error editing product" })
//   }
// }

export async function DELETE(
  req: NextRequest,
  { params }: { params: { categoryName: string } }
) {
  // const id = params.id
  const id = params.categoryName

  const catName = params.categoryName

  try {
    const deletedProduct = await prisma.category.delete({
      where: {
        categoryName: catName,
      },
    })
    return NextResponse.json({
      message: "Category deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ message: "Error deleting product!" })
  }
}
