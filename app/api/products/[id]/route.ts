import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ message: "couldnt fetch product!" })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const {
    title,
    description,
    imageUrl,
    images,
    unit,
    categoryName,
    quantity,
    discount,
    isInStock,
    variants,
  } = await req.json()
  const id = params.id

  try {
    // Start a transaction
    const updatedProduct = await prisma.$transaction(async (prisma) => {
      // Update the main product fields
      const product = await prisma.product.update({
        where: { id },
        data: {
          title,
          description,
          imageUrl,
          images,
          unit,
          categoryName,
          quantity,
          discount,
          isInStock,
        },
      })

      // Handle variants
      const existingVariantIds = (
        await prisma.productVariant.findMany({
          where: { productId: id },
          select: { id: true },
        })
      ).map((v) => v.id)

      const incomingVariantIds = variants.map((v: any) => v.id).filter(Boolean)

      // Delete variants that are no longer in the request
      const variantsToDelete = existingVariantIds.filter(
        (id) => !incomingVariantIds.includes(id)
      )
      if (variantsToDelete.length > 0) {
        await prisma.productVariant.deleteMany({
          where: { id: { in: variantsToDelete } },
        })
      }

      // Update or create variants
      for (const variant of variants) {
        if (variant.id) {
          // Update existing variant
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: {
              price: variant.price,
              weight: variant.weight,
              unit: variant.unit,
            },
          })
        } else {
          // Create new variant
          await prisma.productVariant.create({
            data: {
              productId: id,
              price: variant.price,
              weight: variant.weight,
              unit: variant.unit,
            },
          })
        }
      }

      return product
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { message: "Error editing product" },
      { status: 500 }
    )
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
    return NextResponse.json({ success: true, deletedProduct })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { success: false, message: `Error deleting product: ${error}` },
      { status: 500 }
    )
  }
}
