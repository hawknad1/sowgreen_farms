import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

// export async function PUT(
//   { params }: { params: { id: string } },
//   req: Request
// ) {
//   const { id } = params
//   const { region, city, deliveryFee } = await req.json()
//   try {
//     if (!region || !city || !deliveryFee) {
//       throw new Error("Region,city and delivery fee are required!")
//     }

//     const existingLocation = await prisma.citiesWithFees.findUnique({
//       where: { id },
//     })

//     if (!existingLocation) {
//       return NextResponse.json(
//         { message: "Location not found!" },
//         { status: 404 }
//       )
//     }

//     const updateLocation = await prisma.citiesWithFees.update({
//       where: { id },
//       data: {
//         city,
//         deliveryFee,
//         region,
//       },
//     })

//     return NextResponse.json(updateLocation)
//   } catch (error) {
//     console.log(error)
//     NextResponse.json({ message: "Error updating location" }, { status: 500 })
//   }
// }

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  try {
    const { region, city, deliveryFee } = await req.json()

    if (!region || !city || typeof deliveryFee !== "number") {
      return NextResponse.json(
        { message: "Valid region, city, and delivery fee are required." },
        { status: 400 }
      )
    }

    const updatedLocation = await prisma.citiesWithFees.update({
      where: { id },
      data: { city, deliveryFee, region },
    })

    return NextResponse.json(updatedLocation, { status: 200 })
  } catch (error) {
    console.error("Error updating location:", error)
    return NextResponse.json(
      { message: "An error occurred while updating the location." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    const deleteLocation = await prisma.citiesWithFees.delete({
      where: {
        id,
      },
    })
    return NextResponse.json(
      { message: "Location deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Couldnt delete location" },
      { status: 500 }
    )
  }
}

// export async function GET(
//   { params }: { params?: { id?: string } },
//   req: Request
// ) {
//   try {
//     console.log("Request Params:", params)

//     if (!params || !params.id) {
//       console.error("Invalid or missing 'id' parameter")
//       throw new Error("Invalid or missing 'id' parameter")
//     }

//     const location = await prisma.citiesWithFees.findUnique({
//       where: { id: params.id },
//     })

//     if (!location) {
//       console.error("No location found for id:", params.id)
//       throw new Error("Location not found")
//     }

//     return NextResponse.json(location)
//   } catch (error) {
//     console.error("Error in API route:", error)
//     return NextResponse.json(
//       { message: error || "An error occurred" },
//       { status: 500 }
//     )
//   }
// }

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const location = await prisma.citiesWithFees.findUnique({
      where: { id },
    })
    return NextResponse.json(location)
  } catch (error) {
    return NextResponse.json(
      { message: "couldnt fetch order!" },
      { status: 500 }
    )
  }
}
