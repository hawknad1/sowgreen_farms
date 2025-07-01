import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // const { id } = params
  const { slug } = params

  const { publicId } = await request.json()

  // Validate productId and publicId
  if (!slug) {
    console.error("Missing product ID in route parameters.")
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 }
    )
  }

  if (!publicId) {
    console.error("Missing public ID in request body.")
    return NextResponse.json(
      { message: "Public ID is required" },
      { status: 400 }
    )
  }

  try {
    // Attempt to update product and remove the specified image
    const product = await prisma.product.update({
      where: { slug },
      data: {
        images: {
          deleteMany: { publicId },
        },
      },
    })

    return NextResponse.json({ message: "Image deleted successfully" })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { message: "Failed to delete image" },
      { status: 500 }
    )
  }
}
