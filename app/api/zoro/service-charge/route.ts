import prisma from "@/lib/prismadb"
import { TaxService } from "@/lib/serviceCharge"
import { NextResponse } from "next/server"

// export async function PUT(request: Request) {
//   const { rate, country, region } = await request.json()

//   try {
//     // Deactivate old rates
//     await prisma.taxRate.updateMany({
//       where: { isActive: true },
//       data: { isActive: false },
//     })

//     // Create new active rate
//     const newTaxRate = await prisma.taxRate.create({
//       data: {
//         rate,
//         country,
//         region,
//         isActive: true,
//       },
//     })

//     // Invalidate cache
//     TaxService.invalidateCache()

//     return Response.json({ success: true, taxRate: newTaxRate })
//   } catch (error) {
//     return Response.json(
//       { error: "Failed to update tax rate" },
//       { status: 500 }
//     )
//   }
// }

export async function GET() {
  try {
    const taxRates = await prisma.taxRate.findMany({
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    })

    // Add headers to prevent caching
    return NextResponse.json(taxRates, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })

    return NextResponse.json(taxRates)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tax rates" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { rate, country, region, isActive } = await request.json()

    // If setting as active, deactivate all others
    if (isActive) {
      await prisma.taxRate.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      })
    }

    const taxRate = await prisma.taxRate.create({
      data: {
        rate,
        country: country || null,
        region: region || null,
        isActive: isActive || false,
      },
    })

    // Invalidate cache if this is active
    if (isActive) {
      TaxService.invalidateCache()
    }

    return NextResponse.json(taxRate)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create tax rate" },
      { status: 500 }
    )
  }
}
