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

// In your PUT handler, add price history tracking

// app/api/products/[slug]/route.ts

// app/api/products/[slug]/route.ts
// app/api/products/[slug]/route.ts - Complete working version
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//     const session = await auth()
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json()
//     const { variants, changeNote, ...productData } = body

//     // Get current product data
//     const currentProduct = await prisma.product.findUnique({
//       where: { slug: params.slug },
//       include: { variants: true },
//     })

//     if (!currentProduct) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 })
//     }

//     const historyEntries = []

//     // Define fields to track with their display names
//     const fieldsToTrack = {
//       title: "Product Name",
//       description: "Description",
//       price: "Price",
//       discount: "Discount",
//       isInStock: "Stock Status",
//       quantity: "Quantity",
//       categoryName: "Category",
//       partnerId: "Partner",
//     }

//     console.log("🔍 CHECKING FOR PRODUCT CHANGES...")

//     for (const [field, displayName] of Object.entries(fieldsToTrack)) {
//       const currentValue = currentProduct[field as keyof typeof currentProduct]
//       const newValue = productData[field]

//       // Only proceed if newValue is defined (field was submitted)
//       if (newValue !== undefined) {
//         // Convert to comparable strings
//         const currentStr =
//           currentValue !== null && currentValue !== undefined
//             ? String(currentValue)
//             : "Empty"
//         const newStr =
//           newValue !== null && newValue !== undefined
//             ? String(newValue)
//             : "Empty"

//         const hasChanged = currentStr !== newStr

//         console.log(`📋 ${field}:`, {
//           current: currentStr,
//           new: newStr,
//           changed: hasChanged,
//         })

//         if (hasChanged) {
//           console.log(`🎯 ${field} CHANGED: "${currentStr}" → "${newStr}"`)

//           historyEntries.push({
//             productId: currentProduct.id,
//             fieldChanged: field,
//             oldValue: currentStr === "Empty" ? null : currentStr,
//             newValue: newStr === "Empty" ? null : newStr,
//             changedBy: session.user.name || session.user.email || "Unknown",
//             changedById: session.user.id,
//             changeNote: changeNote || `${displayName} updated`,
//           })
//         }
//       } else {
//         console.log(`⏭️ ${field}: Not provided in update`)
//       }
//     }

//     // Create product history entries
//     if (historyEntries.length > 0) {
//       console.log(
//         `💾 Creating ${historyEntries.length} product history entries`
//       )
//       await prisma.productHistory.createMany({
//         data: historyEntries,
//       })
//     } else {
//       console.log("📝 No product changes detected")
//     }

//     // Track variant changes (existing code)
//     const variantHistoryEntries = []

//     for (let i = 0; i < variants.length; i++) {
//       const variant = variants[i]
//       const currentVariant = currentProduct.variants[i]

//       if (currentVariant) {
//         const variantChanges: any = {
//           variantId: currentVariant.id,
//           changedBy: session.user.name || session.user.email || "Unknown",
//           changedById: session.user.id,
//           changeNote: changeNote || "Variant updated",
//         }

//         let hasChanges = false

//         // Check each field for changes
//         if (
//           variant.price !== undefined &&
//           variant.price !== currentVariant.price
//         ) {
//           variantChanges.oldPrice = currentVariant.price
//           variantChanges.newPrice = variant.price
//           hasChanges = true
//         }

//         if (
//           variant.discountedPrice !== undefined &&
//           variant.discountedPrice !== currentVariant.discountedPrice
//         ) {
//           variantChanges.oldDiscounted = currentVariant.discountedPrice
//           variantChanges.newDiscounted = variant.discountedPrice
//           hasChanges = true
//         }

//         if (
//           variant.weight !== undefined &&
//           variant.weight !== currentVariant.weight
//         ) {
//           variantChanges.oldWeight = currentVariant.weight
//           variantChanges.newWeight = variant.weight
//           hasChanges = true
//         }

//         if (
//           variant.unit !== undefined &&
//           variant.unit !== currentVariant.unit
//         ) {
//           variantChanges.oldUnit = currentVariant.unit
//           variantChanges.newUnit = variant.unit
//           hasChanges = true
//         }

//         if (hasChanges) {
//           variantHistoryEntries.push(variantChanges)
//         }

//         // Update the variant
//         await prisma.productVariant.update({
//           where: { id: currentVariant.id },
//           data: {
//             price: variant.price,
//             weight: variant.weight,
//             unit: variant.unit,
//             discountedPrice: variant.discountedPrice,
//           },
//         })
//       }
//     }

//     // Create variant history entries
//     if (variantHistoryEntries.length > 0) {
//       console.log(
//         `💾 Creating ${variantHistoryEntries.length} variant history entries`
//       )
//       await prisma.variantPriceHistory.createMany({
//         data: variantHistoryEntries,
//       })
//     }

//     // Update main product
//     const updatedProduct = await prisma.product.update({
//       where: { slug: params.slug },
//       data: {
//         title: productData.title,
//         categoryName: productData.categoryName,
//         partnerId: productData.partnerId || null,
//         isInStock: productData.isInStock,
//         discount: productData.discount || null,
//         quantity: productData.quantity,
//         description: productData.description,
//         price: productData.price || null,
//       },
//       include: {
//         variants: true,
//         category: true,
//         partner: true,
//       },
//     })

//     console.log("✅ Product update completed successfully")
//     return NextResponse.json(updatedProduct)
//   } catch (error) {
//     console.error("❌ Error updating product:", error)
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { variants, changeNote, ...productData } = body

    // Get current product data
    const currentProduct = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { variants: true },
    })

    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const historyEntries = []

    // Define fields to track with their display names
    const fieldsToTrack = {
      title: "Product Name",
      description: "Description",
      price: "Price",
      discount: "Discount",
      isInStock: "Stock Status",
      quantity: "Quantity",
      categoryName: "Category",
      partnerId: "Partner",
    }

    console.log("🔍 CHECKING FOR PRODUCT CHANGES...")

    for (const [field, displayName] of Object.entries(fieldsToTrack)) {
      const currentValue = currentProduct[field as keyof typeof currentProduct]
      const newValue = productData[field]

      if (newValue !== undefined) {
        const currentStr =
          currentValue !== null && currentValue !== undefined
            ? String(currentValue)
            : "Empty"
        const newStr =
          newValue !== null && newValue !== undefined
            ? String(newValue)
            : "Empty"

        const hasChanged = currentStr !== newStr

        console.log(`📋 ${field}:`, {
          current: currentStr,
          new: newStr,
          changed: hasChanged,
        })

        if (hasChanged) {
          console.log(`🎯 ${field} CHANGED: "${currentStr}" → "${newStr}"`)

          historyEntries.push({
            productId: currentProduct.id,
            fieldChanged: field,
            oldValue: currentStr === "Empty" ? null : currentStr,
            newValue: newStr === "Empty" ? null : newStr,
            changedBy: session.user.name || session.user.email || "Unknown",
            changedById: session.user.id,
            changeNote: changeNote || `${displayName} updated`,
          })
        }
      } else {
        console.log(`⏭️ ${field}: Not provided in update`)
      }
    }

    // Create product history entries
    if (historyEntries.length > 0) {
      console.log(
        `💾 Creating ${historyEntries.length} product history entries`
      )
      await prisma.productHistory.createMany({
        data: historyEntries,
      })
    } else {
      console.log("📝 No product changes detected")
    }

    // ============================================
    // IMPROVED VARIANT HANDLING
    // ============================================
    const variantHistoryEntries = []
    const currentVariantIds = currentProduct.variants.map((v) => v.id)
    const processedVariantIds = new Set<string>()

    console.log(`📦 Processing ${variants.length} variants...`)

    // Process each variant from the form
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i]
      const currentVariant = currentProduct.variants[i]

      if (currentVariant) {
        // UPDATE EXISTING VARIANT
        console.log(`✏️ Updating existing variant ${i + 1}`)
        processedVariantIds.add(currentVariant.id)

        const variantChanges: any = {
          variantId: currentVariant.id,
          changedBy: session.user.name || session.user.email || "Unknown",
          changedById: session.user.id,
          changeNote: changeNote || `Variant ${i + 1} updated`,
        }

        let hasChanges = false

        // Check each field for changes
        if (
          variant.price !== undefined &&
          variant.price !== currentVariant.price
        ) {
          variantChanges.oldPrice = currentVariant.price
          variantChanges.newPrice = variant.price
          hasChanges = true
        }

        if (
          variant.discountedPrice !== undefined &&
          variant.discountedPrice !== currentVariant.discountedPrice
        ) {
          variantChanges.oldDiscounted = currentVariant.discountedPrice
          variantChanges.newDiscounted = variant.discountedPrice
          hasChanges = true
        }

        if (
          variant.weight !== undefined &&
          variant.weight !== currentVariant.weight
        ) {
          variantChanges.oldWeight = currentVariant.weight
          variantChanges.newWeight = variant.weight
          hasChanges = true
        }

        if (
          variant.unit !== undefined &&
          variant.unit !== currentVariant.unit
        ) {
          variantChanges.oldUnit = currentVariant.unit
          variantChanges.newUnit = variant.unit
          hasChanges = true
        }

        if (hasChanges) {
          variantHistoryEntries.push(variantChanges)
          console.log(`📝 Variant ${i + 1} has changes, tracked in history`)
        }

        // Update the variant
        await prisma.productVariant.update({
          where: { id: currentVariant.id },
          data: {
            price: variant.price,
            weight: variant.weight,
            unit: variant.unit,
            discountedPrice: variant.discountedPrice,
          },
        })
      } else {
        // CREATE NEW VARIANT
        console.log(`➕ Creating new variant ${i + 1}`)

        const newVariant = await prisma.productVariant.create({
          data: {
            productId: currentProduct.id,
            price: variant.price,
            weight: variant.weight,
            unit: variant.unit,
            discountedPrice: variant.discountedPrice,
          },
        })

        // Track new variant creation in history
        variantHistoryEntries.push({
          variantId: newVariant.id,
          oldPrice: null,
          newPrice: variant.price,
          oldWeight: null,
          newWeight: variant.weight,
          oldUnit: null,
          newUnit: variant.unit,
          oldDiscounted: null,
          newDiscounted: variant.discountedPrice,
          changedBy: session.user.name || session.user.email || "Unknown",
          changedById: session.user.id,
          changeNote: changeNote || `New variant ${i + 1} created`,
        })

        console.log(`✅ New variant ${i + 1} created and tracked`)
      }
    }

    // DELETE REMOVED VARIANTS (if user removed variants from the form)
    const variantsToDelete = currentVariantIds.filter(
      (id) => !processedVariantIds.has(id)
    )

    if (variantsToDelete.length > 0) {
      console.log(`🗑️ Deleting ${variantsToDelete.length} removed variants`)

      // Track deletions in history
      for (const variantId of variantsToDelete) {
        const deletedVariant = currentProduct.variants.find(
          (v) => v.id === variantId
        )
        if (deletedVariant) {
          variantHistoryEntries.push({
            variantId: deletedVariant.id,
            oldPrice: deletedVariant.price,
            newPrice: null,
            oldWeight: deletedVariant.weight,
            newWeight: null,
            oldUnit: deletedVariant.unit,
            newUnit: null,
            oldDiscounted: deletedVariant.discountedPrice,
            newDiscounted: null,
            changedBy: session.user.name || session.user.email || "Unknown",
            changedById: session.user.id,
            changeNote: changeNote || "Variant deleted",
          })
        }
      }

      await prisma.productVariant.deleteMany({
        where: { id: { in: variantsToDelete } },
      })
    }

    // Create variant history entries
    if (variantHistoryEntries.length > 0) {
      console.log(
        `💾 Creating ${variantHistoryEntries.length} variant history entries`
      )
      await prisma.variantPriceHistory.createMany({
        data: variantHistoryEntries,
      })
    }

    // Update main product
    const updatedProduct = await prisma.product.update({
      where: { slug: params.slug },
      data: {
        title: productData.title,
        categoryName: productData.categoryName,
        partnerId: productData.partnerId || null,
        isInStock: productData.isInStock,
        discount: productData.discount || null,
        quantity: productData.quantity,
        description: productData.description,
        price: productData.price || null,
      },
      include: {
        variants: true,
        category: true,
        partner: true,
      },
    })

    console.log("✅ Product update completed successfully")
    console.log(
      `📊 Summary: ${historyEntries.length} product changes, ${variantHistoryEntries.length} variant changes`
    )

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("❌ Error updating product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//     const session = await auth()

//     if (!session) {
//       return NextResponse.json(
//         { error: "Unauthorized - You must be logged in" },
//         { status: 401 }
//       )
//     }

//     // Check user role
//     const user = await prisma.user.findUnique({
//       where: { email: session.user?.email },
//     })

//     if (user?.role !== "admin") {
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

//     const updatedProduct = await prisma.$transaction(async (prisma) => {
//       // First get the product ID from the slug
//       const existingProduct = await prisma.product.findUnique({
//         where: { slug: params.slug },
//         select: { id: true },
//       })

//       if (!existingProduct) {
//         throw new Error("Product not found")
//       }

//       const productId = existingProduct.id

//       // Build update data
//       const updateData: any = {
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
//         updateData.category = {
//           connect: { categoryName },
//         }
//       }

//       // Handle partner relationship
//       if (partner !== undefined) {
//         if (partner === null) {
//           updateData.partner = { disconnect: true }
//         } else if (partner.id) {
//           updateData.partner = { connect: { id: partner.id } }
//         }
//       }

//       // Update the product
//       const product = await prisma.product.update({
//         where: { id: productId },
//         data: updateData,
//       })

//       // Only process variants if they're provided in the request
//       if (variants !== undefined) {
//         const existingVariants = await prisma.productVariant.findMany({
//           where: { productId },
//           select: { id: true },
//         })

//         const existingVariantIds = existingVariants.map((v) => v.id)
//         const incomingVariantIds = variants
//           .map((v: any) => v.id)
//           .filter(Boolean)

//         // Delete variants not in the incoming list
//         const variantsToDelete = existingVariantIds.filter(
//           (id) => !incomingVariantIds.includes(id)
//         )

//         if (variantsToDelete.length > 0) {
//           await prisma.productVariant.deleteMany({
//             where: { id: { in: variantsToDelete } },
//           })
//         }

//         // Upsert variants
//         for (const variant of variants) {
//           const variantData = {
//             price: variant.price,
//             weight: variant.weight,
//             unit: variant.unit,
//             discountedPrice:
//               discount && discount > 0
//                 ? variant.price * (1 - discount / 100)
//                 : variant.discountedPrice || null,
//           }

//           if (variant.id) {
//             await prisma.productVariant.update({
//               where: { id: variant.id },
//               data: variantData,
//             })
//           } else {
//             await prisma.productVariant.create({
//               data: {
//                 ...variantData,
//                 productId,
//               },
//             })
//           }
//         }
//       }

//       return product

//       // // Handle variants
//       // const existingVariants = await prisma.productVariant.findMany({
//       //   where: { productId },
//       //   select: { id: true },
//       // })

//       // const existingVariantIds = existingVariants.map((v) => v.id)
//       // const incomingVariantIds = variants.map((v: any) => v.id).filter(Boolean)

//       // // Delete variants not in the incoming list
//       // const variantsToDelete = existingVariantIds.filter(
//       //   (id) => !incomingVariantIds.includes(id)
//       // )

//       // if (variantsToDelete.length > 0) {
//       //   await prisma.productVariant.deleteMany({
//       //     where: { id: { in: variantsToDelete } },
//       //   })
//       // }

//       // // Upsert variants
//       // for (const variant of variants) {
//       //   const variantData = {
//       //     price: variant.price,
//       //     weight: variant.weight,
//       //     unit: variant.unit,
//       //     discountedPrice:
//       //       discount && discount > 0
//       //         ? variant.price * (1 - discount / 100)
//       //         : variant.discountedPrice || null,
//       //   }

//       //   if (variant.id) {
//       //     await prisma.productVariant.update({
//       //       where: { id: variant.id },
//       //       data: variantData,
//       //     })
//       //   } else {
//       //     await prisma.productVariant.create({
//       //       data: {
//       //         ...variantData,
//       //         productId,
//       //       },
//       //     })
//       //   }
//       // }

//       // return product
//     })

//     return NextResponse.json(updatedProduct)
//   } catch (error) {
//     console.error("Error updating product:", error)
//     return NextResponse.json(
//       {
//         error: "Error editing product",
//         message: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     )
//   }
// }
