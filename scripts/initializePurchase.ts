import prisma from "@/lib/prismadb"

export async function initializePurchaseCounts() {
  try {
    // Find products where purchaseCount is null
    const products = await prisma.product.findMany({
      where: {
        purchaseCount: { not: { gte: 0 } }, // Filter to only items where purchaseCount is null
      },
    })

    // Update each product to set purchaseCount to 0
    for (const product of products) {
      await prisma.product.update({
        where: { id: product.id },
        data: { purchaseCount: 0 },
      })
    }

    console.log("Updated existing products with default purchaseCount.")
  } catch (error) {
    console.error("Error initializing purchase counts:", error)
  } finally {
    await prisma.$disconnect() // Ensure Prisma disconnects properly
  }
}

// Run the function
