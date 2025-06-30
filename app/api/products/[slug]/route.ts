import { auth } from "@/auth"
import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = params.id
//     const product = await prisma.product.findUnique({
//       where: { id },
//       include: {
//         variants: true,
//         partner: true,
//       },
//     })
//     return NextResponse.json(product)
//   } catch (error) {
//     return NextResponse.json({ message: "couldnt fetch product!" })
//   }
// }

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
        partner: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { message: "Couldn't fetch product!" },
      { status: 500 }
    )
  }
}

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//     const slug = params.slug
//     const product = await prisma.product.findFirst({
//       where: {
//         OR: [
//           { slug },
//           { id: params.slug }, // Fallback to ID for legacy support
//         ],
//       },
//       include: {
//         variants: true,
//         partner: true,
//       },
//     })

//     if (!product) {
//       return NextResponse.json(
//         { message: "Product not found" },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json(product)
//   } catch (error) {
//     return NextResponse.json({ message: "couldnt fetch product!" })
//   }
// }

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
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

    // const id = params.id
    const slug = params.slug

    const deletedProduct = await prisma.product.delete({
      where: { slug },
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

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await auth()

//     if (!session) {
//       return NextResponse.json(
//         { error: "Unauthorized - You must be logged in" },
//         { status: 401 }
//       )
//     }

//     // 2. Check user role (if you have admin/users distinction)
//     const user = await prisma.user.findUnique({
//       where: { email: session.user?.email },
//     })

//     if (user?.role !== "admin") {
//       // Add this if you want admin-only access
//       return NextResponse.json(
//         { error: "Forbidden - You don't have permission" },
//         { status: 403 }
//       )
//     }

//     const {
//       title,
//       description,
//       imageUrl,
//       images,
//       unit,
//       categoryName,
//       partner,
//       quantity,
//       discount,
//       isInStock,
//       variants,
//     } = await req.json()

//     const id = params.id

//     const updatedProduct = await prisma.$transaction(async (prisma) => {
//       // Build update data
//       const data: any = {
//         title,
//         description,
//         imageUrl,
//         images,
//         unit,
//         quantity,
//         discount,
//         isInStock,
//       }

//       // Handle category relationship
//       if (categoryName !== undefined) {
//         data.category = {
//           connect: { categoryName }, // Connect to category by its name
//         }
//       }

//       // Handle partner relationship
//       if (partner !== undefined) {
//         if (partner === null) {
//           data.partner = { disconnect: true }
//         } else if (partner.id) {
//           data.partner = { connect: { id: partner.id } }
//         }
//       }

//       // Update the product with only the defined fields
//       const product = await prisma.product.update({
//         where: { id },
//         data,
//       })

//       // Handle variants only if it's an array
//       if (Array.isArray(variants)) {
//         const existingVariantIds = (
//           await prisma.productVariant.findMany({
//             where: { productId: id },
//             select: { id: true },
//           })
//         ).map((v) => v.id)

//         const incomingVariantIds = variants
//           .map((v: any) => v.id)
//           .filter(Boolean)

//         const variantsToDelete = existingVariantIds.filter(
//           (variantId) => !incomingVariantIds.includes(variantId)
//         )

//         if (variantsToDelete.length > 0) {
//           await prisma.productVariant.deleteMany({
//             where: { id: { in: variantsToDelete } },
//           })
//         }

//         for (const variant of variants) {
//           const discountedPrice =
//             discount && discount > 0
//               ? variant.price * (1 - discount / 100)
//               : null

//           if (variant.id) {
//             await prisma.productVariant.update({
//               where: { id: variant.id },
//               data: {
//                 price: variant.price,
//                 weight: variant.weight,
//                 unit: variant.unit,
//                 discountedPrice,
//               },
//             })
//           } else {
//             await prisma.productVariant.create({
//               data: {
//                 productId: id,
//                 price: variant.price,
//                 weight: variant.weight,
//                 unit: variant.unit,
//                 discountedPrice,
//               },
//             })
//           }
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - You must be logged in" },
        { status: 401 }
      )
    }

    // Check user role
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email },
    })

    if (user?.role !== "admin") {
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
      partner,
      quantity,
      discount,
      isInStock,
      variants = [],
    } = await req.json()

    const updatedProduct = await prisma.$transaction(async (prisma) => {
      // First get the product ID from the slug
      const existingProduct = await prisma.product.findUnique({
        where: { slug: params.slug },
        select: { id: true },
      })

      if (!existingProduct) {
        throw new Error("Product not found")
      }

      const productId = existingProduct.id

      // Build update data
      const updateData: any = {
        title,
        description,
        imageUrl,
        images,
        unit,
        quantity,
        discount,
        isInStock,
      }

      // Handle category relationship
      if (categoryName !== undefined) {
        updateData.category = {
          connect: { categoryName },
        }
      }

      // Handle partner relationship
      if (partner !== undefined) {
        if (partner === null) {
          updateData.partner = { disconnect: true }
        } else if (partner.id) {
          updateData.partner = { connect: { id: partner.id } }
        }
      }

      // Update the product
      const product = await prisma.product.update({
        where: { id: productId },
        data: updateData,
      })

      // Handle variants
      const existingVariants = await prisma.productVariant.findMany({
        where: { productId },
        select: { id: true },
      })

      const existingVariantIds = existingVariants.map((v) => v.id)
      const incomingVariantIds = variants.map((v: any) => v.id).filter(Boolean)

      // Delete variants not in the incoming list
      const variantsToDelete = existingVariantIds.filter(
        (id) => !incomingVariantIds.includes(id)
      )

      if (variantsToDelete.length > 0) {
        await prisma.productVariant.deleteMany({
          where: { id: { in: variantsToDelete } },
        })
      }

      // Upsert variants
      for (const variant of variants) {
        const variantData = {
          price: variant.price,
          weight: variant.weight,
          unit: variant.unit,
          discountedPrice:
            discount && discount > 0
              ? variant.price * (1 - discount / 100)
              : variant.discountedPrice || null,
        }

        if (variant.id) {
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: variantData,
          })
        } else {
          await prisma.productVariant.create({
            data: {
              ...variantData,
              productId,
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
      {
        error: "Error editing product",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
