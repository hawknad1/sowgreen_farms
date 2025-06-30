import { PrismaClient } from "@prisma/client"
import { slugify } from "./lib/utils/slugify"

const prisma = new PrismaClient()

async function main() {
  // Get all products without slugs
  const products = await prisma.product.findMany({
    where: {
      slug: null,
    },
  })

  // Update each product with a slug
  for (const product of products) {
    let slug = slugify(product.title)

    // Check if slug already exists
    let counter = 1
    let uniqueSlug = slug

    while (true) {
      const existing = await prisma.product.findFirst({
        where: { slug: uniqueSlug },
      })

      if (!existing || existing.id === product.id) break

      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { slug: uniqueSlug },
    })

    console.log(`Updated product ${product.id} with slug: ${uniqueSlug}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
