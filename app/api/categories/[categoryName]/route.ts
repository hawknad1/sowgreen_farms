import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { categoryName: string } }
) {
  try {
    const catName = params.categoryName
    const category = await prisma.category.findMany({
      where: { categoryName: catName },
      include: {
        products: { include: { variants: true, partner: true } },
      },
    })
    const response = NextResponse.json(category)
    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://sowgreen-farms.vercel.app"
    )
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
    return response
  } catch (error) {
    return NextResponse.json({ message: "couldnt fetch category!" })
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

  try {
    const deletedProduct = await prisma.category.delete({
      where: { id },
    })
    return NextResponse.json({
      message: "Category deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ message: "Error deleting product!" })
  }
}
