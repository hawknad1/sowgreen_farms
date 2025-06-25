// // app/api/products/bulk-delete/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import fs from "fs/promises";
// import path from "path";
// import Papa from "papaparse";
// import prisma from "@/lib/prismadb";

// /**
//  * This API endpoint handles the bulk deletion of products.
//  * It reads product titles from a specified CSV file and deletes them
//  * from the database. This is a protected and destructive action.
//  */
// export async function DELETE(req: NextRequest) {
//   // 1. SECURE THE ENDPOINT
//   // This endpoint should only be triggered by a trusted internal request.
//   const internalApiKey = req.headers.get("x-internal-api-key");
//   if (internalApiKey !== process.env.INTERNAL_API_KEY) {
//     return NextResponse.json(
//       { error: "Forbidden - Invalid API Key" },
//       { status: 403 }
//     );
//   }

//   try {
//     // 2. LOCATE AND READ THE CSV FILE
//     const filePath = path.join(process.cwd(), "products - products.csv");
//     const fileContent = await fs.readFile(filePath, "utf-8");

//     const parseResult = Papa.parse(fileContent, {
//       header: true,
//       skipEmptyLines: true,
//     });

//     if (parseResult.errors.length > 0) {
//         return NextResponse.json({
//             error: "Failed to parse CSV file.",
//             details: parseResult.errors
//         }, { status: 400 });
//     }

//     // 3. EXTRACT UNIQUE PRODUCT TITLES
//     // We use a Set to ensure we have a list of unique titles, even if some are repeated in the CSV.
//     const productTitles = new Set<string>();
//     for (const row of parseResult.data as any[]) {
//       if (row.TITLE && typeof row.TITLE === 'string' && row.TITLE.trim() !== '') {
//         productTitles.add(row.TITLE.trim());
//       }
//     }

//     const titlesToDelete = Array.from(productTitles);

//     if (titlesToDelete.length === 0) {
//         return NextResponse.json({
//             message: "No product titles found in the CSV to delete.",
//             deletedCount: 0,
//         });
//     }

//     // 4. PERFORM THE BULK DELETION
//     // Prisma's `deleteMany` is highly efficient for this task.
//     // Deleting the products will also cascade and delete their associated variants.
//     const deleteResult = await prisma.product.deleteMany({
//       where: {
//         title: {
//           in: titlesToDelete,
//         },
//       },
//     });

//     // 5. RETURN A SUCCESS RESPONSE
//     return NextResponse.json({
//       message: "Bulk delete process completed successfully.",
//       deletedCount: deleteResult.count,
//       titlesTargetedForDeletion: titlesToDelete,
//     });

//   } catch (error: any) {
//     // Handle specific errors like the file not being found
//     if (error.code === 'ENOENT') {
//         return NextResponse.json(
//             { error: "Bulk delete failed.", details: "The CSV file was not found. Please ensure 'products - products.csv' is in the project root." },
//             { status: 500 }
//         );
//     }
//     // Handle general server errors
//     console.error("Fatal error during bulk delete:", error);
//     return NextResponse.json(
//       { error: "An unexpected error occurred during the bulk delete process.", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// app/api/products/bulk-delete/route.ts
import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import Papa from "papaparse"
import prisma from "@/lib/prismadb"
import { Prisma } from "@prisma/client"

function escapeRegex(text: string): string {
  if (!text) return ""
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * FINAL CLEANUP SCRIPT
 * This API endpoint handles the final bulk deletion of remaining products.
 * It uses a broad "startsWith" (for categories) and "contains" (for product names)
 * search to find all truncated and messy titles.
 */
export async function DELETE(req: NextRequest) {
  // 1. SECURE THE ENDPOINT
  const internalApiKey = req.headers.get("x-internal-api-key")
  if (internalApiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json(
      { error: "Forbidden - Invalid API Key" },
      { status: 403 }
    )
  }

  try {
    // 2. LOCATE AND READ THE CSV FILE
    // IMPORTANT: This script now uses the NEW CSV with proper headers.
    const csvFileName = "products - products.csv"
    const filePath = path.join(process.cwd(), csvFileName)
    const fileContent = await fs.readFile(filePath, "utf-8")

    const parseResult = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    })

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        {
          error: `Failed to parse CSV file: ${csvFileName}`,
          details: parseResult.errors,
        },
        { status: 400 }
      )
    }

    // 3. EXTRACT UNIQUE CATEGORIES AND PRODUCT TITLES
    const categoryNames = new Set<string>()
    const productTitles = new Set<string>()

    for (const row of parseResult.data as any[]) {
      const category = row["CATEGORYNAME"]?.trim()
      const title = row["TITLE"]?.trim()
      if (category) categoryNames.add(category)
      if (title) productTitles.add(title)
    }

    const uniqueCategories = Array.from(categoryNames)
    const uniqueTitles = Array.from(productTitles)

    if (uniqueCategories.length === 0 && uniqueTitles.length === 0) {
      return NextResponse.json({
        message: "No categories or titles found in the CSV file to target.",
      })
    }

    // 4. PERFORM THE DELETION WITHIN A TRANSACTION
    const transactionResult = await prisma.$transaction(async (tx) => {
      // STEP 1: Build the broad "scorched earth" search filter.
      const searchConditions: Prisma.ProductWhereInput[] = []

      // Condition 1: Find any title that STARTS WITH a known category name
      uniqueCategories.forEach((cat) => {
        searchConditions.push({
          title: { startsWith: cat, mode: "insensitive" },
        })
      })

      // Condition 2: Find any title that CONTAINS a known product name
      uniqueTitles.forEach((name) => {
        searchConditions.push({
          title: { contains: escapeRegex(name), mode: "insensitive" },
        })
      })

      const whereClause: Prisma.ProductWhereInput = { OR: searchConditions }

      // STEP 2: Find all matching products.
      const productsToDelete = await tx.product.findMany({
        where: whereClause,
        select: { id: true, title: true },
      })

      const productIdsToDelete = productsToDelete.map((p) => p.id)
      const actualTitlesFound = productsToDelete.map((p) => p.title)

      if (productIdsToDelete.length === 0) {
        return { deletedProducts: 0, deletedWishlistItems: 0, titlesFound: [] }
      }

      // STEP 3: Clean up dependencies (Wishlist items).
      const deletedWishlistItemsResult = await tx.wishlist.deleteMany({
        where: { productId: { in: productIdsToDelete } },
      })

      // STEP 4: Delete the products by their unique IDs.
      const deletedProductsResult = await tx.product.deleteMany({
        where: { id: { in: productIdsToDelete } },
      })

      return {
        deletedProducts: deletedProductsResult.count,
        deletedWishlistItems: deletedWishlistItemsResult.count,
        titlesFound: actualTitlesFound,
      }
    })

    // 5. RETURN A FINAL SUCCESS RESPONSE
    return NextResponse.json({
      message: "Final cleanup delete process completed successfully.",
      deletedProductsCount: transactionResult.deletedProducts,
      deletedWishlistItemsCount: transactionResult.deletedWishlistItems,
      actualDatabaseTitlesDeleted: transactionResult.titlesFound,
    })
  } catch (error: any) {
    console.error("Fatal error during final cleanup delete:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred during the final cleanup process.",
        details: error.message,
      },
      { status: 500 }
    )
  }
}

// // app/api/products/bulk-delete/route.ts
// import { NextRequest, NextResponse } from "next/server"
// import fs from "fs/promises"
// import path from "path"
// import Papa from "papaparse" // <--- FIX 1: Added the missing import for PapaParse
// import prisma from "@/lib/prismadb" // Assuming this is your correct Prisma client path

// /**
//  * This API endpoint handles the bulk deletion of products from a CSV file.
//  * It correctly handles dependencies by deleting associated Wishlist items
//  * before deleting the products themselves.
//  */
// export async function DELETE(req: NextRequest) {
//   // 1. SECURE THE ENDPOINT
//   const internalApiKey = req.headers.get("x-internal-api-key")
//   if (internalApiKey !== process.env.INTERNAL_API_KEY) {
//     return NextResponse.json(
//       { error: "Forbidden - Invalid API Key" },
//       { status: 403 }
//     )
//   }

//   try {
//     // 2. LOCATE AND READ THE CSV FILE
//     const oldCsvFileName = "products.csv" // Using the filename from your last run
//     const filePath = path.join(process.cwd(), oldCsvFileName)
//     const fileContent = await fs.readFile(filePath, "utf-8")

//     const parseResult = Papa.parse(fileContent, {
//       header: true,
//       skipEmptyLines: true,
//     })

//     if (parseResult.errors.length > 0) {
//       return NextResponse.json(
//         {
//           error: `Failed to parse CSV file: ${oldCsvFileName}`,
//           details: parseResult.errors,
//         },
//         { status: 400 }
//       )
//     }

//     // 3. EXTRACT UNIQUE PRODUCT TITLES
//     const productTitles = new Set<string>()
//     for (const row of parseResult.data as any[]) {
//       const productName = row["PRODUCT NAME"]?.trim()
//       if (productName) {
//         productTitles.add(productName)
//       }
//     }

//     const titlesToDelete = Array.from(productTitles)
//     if (titlesToDelete.length === 0) {
//       return NextResponse.json({
//         message: "No product names found in the specified CSV file to delete.",
//       })
//     }

//     // 4. PERFORM THE DELETION WITHIN A TRANSACTION
//     const transactionResult = await prisma.$transaction(async (tx) => {
//       // STEP 1: Find the IDs of all products we need to delete.
//       const productsToDelete = await tx.product.findMany({
//         where: { title: { in: titlesToDelete } },
//         select: { id: true },
//       })
//       const productIdsToDelete = productsToDelete.map((p) => p.id)

//       if (productIdsToDelete.length === 0) {
//         return { deletedProducts: 0, deletedWishlistItems: 0 }
//       }

//       // STEP 2: FIX - Delete dependent Wishlist items first.
//       // Based on the error, we now know the field is `productId`.
//       const deletedWishlistItemsResult = await tx.wishlist.deleteMany({
//         where: {
//           productId: {
//             in: productIdsToDelete,
//           },
//         },
//       })

//       // STEP 3: Now that dependencies are gone, delete the products.
//       const deletedProductsResult = await tx.product.deleteMany({
//         where: {
//           id: {
//             in: productIdsToDelete,
//           },
//         },
//       })

//       return {
//         deletedProducts: deletedProductsResult.count,
//         deletedWishlistItems: deletedWishlistItemsResult.count,
//       }
//     })

//     // 5. RETURN A SUCCESS RESPONSE
//     return NextResponse.json({
//       message: "Bulk delete process completed successfully.",
//       deletedProductsCount: transactionResult.deletedProducts,
//       deletedWishlistItemsCount: transactionResult.deletedWishlistItems,
//       titlesTargetedForDeletion: titlesToDelete,
//     })
//   } catch (error: any) {
//     if (error.code === "ENOENT") {
//       return NextResponse.json(
//         {
//           error: "Bulk delete failed.",
//           details:
//             "The CSV file was not found. Please ensure the filename is correct.",
//         },
//         { status: 500 }
//       )
//     }
//     console.error("Fatal error during bulk delete:", error)
//     return NextResponse.json(
//       {
//         error: "An unexpected error occurred during the bulk delete process.",
//         details: error.message,
//       },
//       { status: 500 }
//     )
//   }
// }
