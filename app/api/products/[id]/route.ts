import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const product = await prisma.product.findUnique({ where: { id } })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ message: "couldnt fetch product!" })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { title, description, price, imageUrl, categoryName } = await req.json()
  const id = params.id
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        categoryName,
        description,
        imageUrl,
        price,
      },
    })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ message: "Error editing product" })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id },
    })
    return NextResponse.json(deletedProduct)
  } catch (error) {
    return NextResponse.json({ message: "Error deleting product!" })
  }
}
