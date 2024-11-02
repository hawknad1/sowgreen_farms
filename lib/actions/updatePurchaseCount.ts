import prisma from "@/lib/prismadb"

export async function updatePurchaseCounts(productIds: string[]) {
  for (const productId of productIds) {
    await prisma.product.update({
      where: { id: productId },
      data: { purchaseCount: { increment: 1 } },
    })
  }
}
