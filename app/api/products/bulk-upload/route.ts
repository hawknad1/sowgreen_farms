// import { NextRequest, NextResponse } from "next/server"
// import fs from "fs/promises"
// import path from "path"
// import { generateDescriptionForProduct } from "@/lib/ai/openAi"

// // Define the structure for a parsed product variant from a single line
// interface ParsedVariant {
//   fullVariantText: string
//   price: number
//   weight: number
//   unit: string
// }

// // Define the structure for a product ready to be uploaded, with multiple variants
// interface ProcessedProduct {
//   title: string
//   categoryName: string
//   variants: {
//     price: number
//     weight?: number
//     unit?: string
//   }[]
// }

// /**
//  * Parses a single line from the CSV to extract product details.
//  * e.g., "Mushrooms 45 cedis/400g" or "Basil regular 15 cedis"
//  * @param line - A single row string from the CSV file.
//  * @returns A ParsedVariant object or null if the line is not a product.
//  */
// function parseProductLine(line: string): ParsedVariant | null {
//   if (!line || line.trim() === "") return null

//   // Regex to capture price (e.g., "45 cedis") and weight/unit (e.g., "400g", "1kg", "250ml")
//   const priceRegex = /(\d+(\.\d+)?)\s*cedis/i
//   const weightRegex = /(\d+(\.\d+)?)\s*(g|kg|ml|ltr|pc|pcs)\b/i

//   const priceMatch = line.match(priceRegex)
//   const weightMatch = line.match(weightRegex)

//   // Apply defaults as per your rules
//   const price = priceMatch ? parseFloat(priceMatch[1]) : 20
//   const weight = weightMatch ? parseFloat(weightMatch[1]) : 200
//   const unit = weightMatch ? weightMatch[3].toLowerCase() : "g"

//   // The full line itself serves as the unique identifier for the variant
//   const fullVariantText = line.trim()

//   return {
//     fullVariantText,
//     price,
//     weight,
//     unit,
//   }
// }

// /**
//  * This is the main API endpoint for handling the bulk upload.
//  * It reads the CSV, processes each line, groups variants, generates descriptions,
//  * and posts the final products to the /api/products endpoint.
//  */
// export async function POST(req: NextRequest) {
//   try {
//     const filePath = path.join(process.cwd(), "products.csv")
//     const fileContent = await fs.readFile(filePath, "utf-8")

//     const rows = fileContent
//       .split("\n")
//       .map((row) => row.trim())
//       .filter(Boolean)

//     let currentCategory = "Uncategorized"
//     const productMap = new Map<string, ProcessedProduct>()

//     // These are the specific category headers from your file used to group products
//     const categoryHeaders = new Set([
//       "Farming Supplies",
//       "Vegetables",
//       "Meat & Poultry",
//       "Processed Meats",
//       "Seafood",
//       "Beverages",
//       "Fruits",
//       "Sauces & Condiments",
//       "Preservatives",
//       "Fat & Oils",
//       "Nuts",
//       "Coffee",
//       "Ice Cream & Sorbets",
//       "Seeds & Seedlings",
//       "Other",
//       "Spicies & Herbs",
//     ])

//     for (const line of rows) {
//       if (categoryHeaders.has(line)) {
//         currentCategory = line
//         continue // Move to the next line after setting the category
//       }

//       const parsedVariant = parseProductLine(line)
//       if (!parsedVariant) continue

//       // --- Smart Grouping Logic ---
//       // We will group variants under a common base name.
//       // e.g., "Kale (Zambian)" and "Kale Curly" will both be under the product "Kale".
//       // e.g., "Coffee Leklebi Ground" and "Coffee Leklebi Whole Bean" under "Coffee Leklebi".
//       let baseTitle = parsedVariant.fullVariantText
//         .replace(/(\d+(\.\d+)?)\s*cedis.*/i, "") // Remove price and everything after
//         .replace(/\(.*\)/, "") // Remove anything in parentheses
//         .trim()

//       // A simple heuristic for better grouping
//       const words = baseTitle.split(" ")
//       if (words.length > 2) {
//         baseTitle = words.slice(0, 2).join(" ")
//       } else {
//         baseTitle = words[0]
//       }
//       baseTitle = baseTitle.replace(/,$/, "").trim() // Clean trailing commas
//       if (!baseTitle) baseTitle = "Unnamed Product"

//       // If the product group doesn't exist, create it
//       if (!productMap.has(baseTitle)) {
//         productMap.set(baseTitle, {
//           title: baseTitle,
//           categoryName: currentCategory,
//           variants: [],
//         })
//       }

//       // Add the parsed variant to its product group
//       productMap.get(baseTitle)!.variants.push({
//         price: parsedVariant.price,
//         weight: parsedVariant.weight,
//         unit: parsedVariant.unit,
//       })
//     }

//     const productsToUpload = Array.from(productMap.values())
//     let successfulUploads = 0
//     const failedUploads = []

//     // --- Process and Upload Each Grouped Product ---
//     for (const product of productsToUpload) {
//       try {
//         const description = await generateDescriptionForProduct(product.title)

//         const payload = {
//           title: product.title,
//           description: description,
//           categoryName: product.categoryName,
//           variants: product.variants,
//           quantity: 100, // Default quantity
//           isInStock: "in-stock", // Default status
//           imageUrl: "",
//           //   images: [],
//           discount: 0,
//         }

//         // Make the internal API call to your create product endpoint
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               "x-internal-api-key": process.env.INTERNAL_API_KEY!,
//             },
//             body: JSON.stringify(payload),
//           }
//         )

//         if (response.ok) {
//           successfulUploads++
//         } else {
//           const errorData = await response.json()
//           // Gracefully skip products that already exist
//           if (response.status === 409) {
//             console.log(`Skipping existing product: ${product.title}`)
//           } else {
//             failedUploads.push({
//               title: product.title,
//               status: response.status,
//               error: errorData,
//             })
//           }
//         }
//       } catch (e: any) {
//         failedUploads.push({ title: product.title, error: e.message })
//       }
//     }

//     return NextResponse.json({
//       message: "Bulk upload process completed.",
//       successfulUploads,
//       skippedExisting:
//         productsToUpload.length - successfulUploads - failedUploads.length,
//       failedUploadsCount: failedUploads.length,
//       failures: failedUploads,
//     })
//   } catch (error: any) {
//     console.error("Fatal error during bulk upload:", error)
//     return NextResponse.json(
//       { error: "Failed to process bulk upload.", details: error.message },
//       { status: 500 }
//     )
//   }
// }

// app/api/products/bulk-upload/route.ts
import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import Papa from "papaparse"
import { generateDescriptionForProduct } from "@/lib/ai/openAi"

// Define the structure for a product after being processed
interface ProcessedProduct {
  title: string
  categoryName: string
  description: string
  variants: {
    price: number
    weight?: number
    unit?: string
  }[]
}

/**
 * Parses a price string (e.g., "20 cedis", "25cedis") to extract a number.
 * @param priceInput - The string from the PRICE column.
 * @returns A number, or the default price of 20.
 */
function parsePrice(priceInput: string | undefined | null): number {
  if (!priceInput) return 20
  const match = priceInput.match(/(\d+(\.\d+)?)/)
  return match ? parseFloat(match[1]) : 20
}

/**
 * Parses a weight string (e.g., "200g", "1kg") to extract a number.
 * @param weightInput - The string from the WEIGHT column.
 * @returns A number, or the default weight of 200.
 */
function parseWeight(weightInput: string | undefined | null): number {
  if (!weightInput) return 200
  const match = weightInput.match(/(\d+(\.\d+)?)/)
  return match ? parseFloat(match[1]) : 200
}

/**
 * This is the main API endpoint for handling the bulk upload.
 * It now uses a proper CSV parser to read the file with headers.
 */
export async function POST(req: NextRequest) {
  try {
    // Make sure the filename here matches the one in your project root
    const filePath = path.join(process.cwd(), "products-new.csv")
    const fileContent = await fs.readFile(filePath, "utf-8")

    // Use PapaParse to process the CSV file with headers
    const parseResult = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    })

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        {
          error: "Failed to parse CSV file.",
          details: parseResult.errors,
        },
        { status: 400 }
      )
    }

    const productMap = new Map<string, ProcessedProduct>()

    // --- Process each row from the CSV ---
    for (const row of parseResult.data as any[]) {
      const title = row.TITLE?.trim()
      if (!title) continue // Skip rows without a title

      // If this product title hasn't been seen before, create a new entry
      if (!productMap.has(title)) {
        productMap.set(title, {
          title: title,
          categoryName: row.CATEGORYNAME?.trim() || "Uncategorized",
          description: row.DESCRIPTION?.trim() || "", // Keep description empty for now
          variants: [],
        })
      }

      // Add the current row as a variant to the existing product
      const product = productMap.get(title)!
      product.variants.push({
        price: parsePrice(row.PRICE),
        weight: parseWeight(row.WEIGHT),
        unit: row.UNIT?.trim() || "g",
      })
    }

    const productsToUpload = Array.from(productMap.values())
    let successfulUploads = 0
    const failedUploads = []

    // --- Process and Upload Each Grouped Product ---
    for (const product of productsToUpload) {
      try {
        // Generate a description ONLY if one wasn't provided in the CSV
        let description = product.description
        if (!description) {
          description = await generateDescriptionForProduct(product.title)
        }

        const payload = {
          title: product.title,
          description: description,
          categoryName: product.categoryName,
          variants: product.variants,
          quantity: 100, // Default quantity
          isInStock: "in-stock",
          imageUrl: "",
          //   images: [],
          discount: 0,
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-api-key": process.env.INTERNAL_API_KEY!,
            },
            body: JSON.stringify(payload),
          }
        )

        if (response.ok) {
          successfulUploads++
        } else {
          const errorData = await response.json()
          if (response.status === 409) {
            // 409 Conflict for existing products
            console.log(`Skipping existing product: ${product.title}`)
          } else {
            failedUploads.push({
              title: product.title,
              status: response.status,
              error: errorData,
            })
          }
        }
      } catch (e: any) {
        failedUploads.push({ title: product.title, error: e.message })
      }
    }

    return NextResponse.json({
      message: "Bulk upload process completed.",
      successfulUploads,
      skippedExisting:
        productsToUpload.length - successfulUploads - failedUploads.length,
      failedUploadsCount: failedUploads.length,
      failures: failedUploads,
    })
  } catch (error: any) {
    // Handle file not found error separately for clarity
    if (error.code === "ENOENT") {
      return NextResponse.json(
        {
          error: "Failed to process bulk upload.",
          details:
            "The CSV file was not found. Please ensure 'products - products.csv' is in the project root.",
        },
        { status: 500 }
      )
    }
    console.error("Fatal error during bulk upload:", error)
    return NextResponse.json(
      { error: "Failed to process bulk upload.", details: error.message },
      { status: 500 }
    )
  }
}
