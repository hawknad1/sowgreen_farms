// app/api/generate-slugs/route.ts
import { NextResponse } from "next/server"
import { slugify } from "@/lib/utils/slugify"
import prisma from "@/lib/prismadb"

export async function GET() {
  try {
    // Solution 1: First try to find null slugs using Prisma's standard methods
    let productsNeedingSlugs = await prisma.product.findMany({
      where: {
        OR: [
          { slug: null }, // Matches explicit null
          { slug: "" }, // Matches empty string
          { slug: { equals: null } }, // Alternative null check
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    })

    // Solution 2: If no results, try a different approach
    if (productsNeedingSlugs.length === 0) {
      // Get all products and filter in JavaScript
      const allProducts = await prisma.product.findMany({
        select: { id: true, title: true, slug: true },
      })

      productsNeedingSlugs = allProducts.filter(
        (p) => p.slug === null || p.slug === "" || p.slug === undefined
      )
    }

    console.log(`Found ${productsNeedingSlugs.length} products needing slugs`)

    const results = []
    for (const product of productsNeedingSlugs) {
      try {
        const baseSlug = slugify(product.title)
        let finalSlug = baseSlug
        let counter = 1

        // Check for existing slugs
        while (true) {
          const existing = await prisma.product.findFirst({
            where: {
              slug: finalSlug,
              NOT: { id: product.id },
            },
          })
          if (!existing) break
          finalSlug = `${baseSlug}-${counter}`
          counter++
        }

        await prisma.product.update({
          where: { id: product.id },
          data: { slug: finalSlug },
        })

        results.push({
          id: product.id,
          title: product.title,
          newSlug: finalSlug,
        })
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      found: productsNeedingSlugs.length,
      processed: results.length,
      results,
    })
  } catch (error: any) {
    console.error("Error in generate-slugs:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
