import { auth } from "@/auth"
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

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const {
//     title,
//     description,
//     imageUrl,
//     images,
//     unit,
//     categoryName,
//     quantity,
//     discount,
//     isInStock,
//     variants,
//   } = await req.json()
//   const id = params.id

//   try {
//     // Start a transaction
//     const updatedProduct = await prisma.$transaction(async (prisma) => {
//       // Update the main product fields
//       const product = await prisma.product.update({
//         where: { id },
//         data: {
//           title,
//           description,
//           imageUrl,
//           images,
//           unit,
//           categoryName,
//           quantity,
//           discount,
//           isInStock,
//         },
//       })

//       // Handle variants
//       const existingVariantIds = (
//         await prisma.productVariant.findMany({
//           where: { productId: id },
//           select: { id: true },
//         })
//       ).map((v) => v.id)

//       const incomingVariantIds = variants.map((v: any) => v.id).filter(Boolean)

//       // Delete variants that are no longer in the request
//       const variantsToDelete = existingVariantIds.filter(
//         (id) => !incomingVariantIds.includes(id)
//       )
//       if (variantsToDelete.length > 0) {
//         await prisma.productVariant.deleteMany({
//           where: { id: { in: variantsToDelete } },
//         })
//       }

//       // Update or create variants
//       for (const variant of variants) {
//         // Calculate discounted price if discount is greater than 0
//         const discountedPrice =
//           discount > 0 ? variant.price * (1 - discount / 100) : null

//         if (variant.id) {
//           // Update existing variant
//           await prisma.productVariant.update({
//             where: { id: variant.id },
//             data: {
//               price: variant.price,
//               weight: variant.weight,
//               unit: variant.unit,
//               discountedPrice: discountedPrice ? discountedPrice : null,
//             },
//           })
//         } else {
//           // Create new variant
//           await prisma.productVariant.create({
//             data: {
//               productId: id,
//               price: variant.price,
//               weight: variant.weight,
//               unit: variant.unit,
//               discountedPrice: discountedPrice ? discountedPrice : null,
//             },
//           })
//         }
//       }

//       return product
//     })

//     return NextResponse.json(updatedProduct)
//   } catch (error) {
//     console.error("Error updating product:", error)
//     return NextResponse.json(
//       { message: "Error editing product" },
//       { status: 500 }
//     )
//   }
// }

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - You must be logged in" },
        { status: 401 }
      )
    }

    // 2. Check user role (if you have admin/users distinction)
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email },
    })

    if (user?.role !== "admin") {
      // Add this if you want admin-only access
      return NextResponse.json(
        { error: "Forbidden - You don't have permission" },
        { status: 403 }
      )
    }

    const id = params.id

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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - You must be logged in" },
        { status: 401 }
      )
    }

    // 2. Check user role (if you have admin/users distinction)
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email },
    })

    if (user?.role !== "admin") {
      // Add this if you want admin-only access
      return NextResponse.json(
        { error: "Forbidden - You don't have permission" },
        { status: 403 }
      )
    }

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

    const updatedProduct = await prisma.$transaction(async (prisma) => {
      // Build update data dynamically
      const data: any = {}
      if (title !== undefined) data.title = title
      if (description !== undefined) data.description = description
      if (imageUrl !== undefined) data.imageUrl = imageUrl
      if (images !== undefined) data.images = images
      if (unit !== undefined) data.unit = unit
      if (categoryName !== undefined) data.categoryName = categoryName
      if (quantity !== undefined) data.quantity = quantity
      if (discount !== undefined) data.discount = discount
      if (isInStock !== undefined) data.isInStock = isInStock

      // Update the product with only the defined fields
      const product = await prisma.product.update({
        where: { id },
        data,
      })

      // Handle variants only if it's an array
      if (Array.isArray(variants)) {
        const existingVariantIds = (
          await prisma.productVariant.findMany({
            where: { productId: id },
            select: { id: true },
          })
        ).map((v) => v.id)

        const incomingVariantIds = variants
          .map((v: any) => v.id)
          .filter(Boolean)

        const variantsToDelete = existingVariantIds.filter(
          (variantId) => !incomingVariantIds.includes(variantId)
        )

        if (variantsToDelete.length > 0) {
          await prisma.productVariant.deleteMany({
            where: { id: { in: variantsToDelete } },
          })
        }

        for (const variant of variants) {
          const discountedPrice =
            discount && discount > 0
              ? variant.price * (1 - discount / 100)
              : null

          if (variant.id) {
            await prisma.productVariant.update({
              where: { id: variant.id },
              data: {
                price: variant.price,
                weight: variant.weight,
                unit: variant.unit,
                discountedPrice,
              },
            })
          } else {
            await prisma.productVariant.create({
              data: {
                productId: id,
                price: variant.price,
                weight: variant.weight,
                unit: variant.unit,
                discountedPrice,
              },
            })
          }
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
