import prisma from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

// export async function GET(req: NextRequest) {
//   try {
//     const pickupOptions = await prisma.pickupOption.findMany()
//     return NextResponse.json(pickupOptions, { status: 200 })
//   } catch (error) {
//     console.error("Error fetching pickup locations:", error)
//     return NextResponse.json(
//       { error: "Couldn't get all pickup locations" },
//       { status: 500 }
//     )
//   }
// }

// export async function PUT(req: NextRequest) {
//   const { pickupOptions } = await req.json()

//   console.log("Received data:", { pickupOptions })

//   // Validation: Ensure that pickupOptions is a non-empty array
//   if (
//     !pickupOptions ||
//     !Array.isArray(pickupOptions) ||
//     pickupOptions.length === 0
//   ) {
//     return NextResponse.json(
//       { message: "Please select at least one pickup location" },
//       { status: 400 }
//     )
//   }

//   try {
//     // First, delete all existing pickup options
//     await prisma.pickupOption.deleteMany()

//     // Then, add the new pickup options
//     const updatedLocations = await prisma.pickupOption.createMany({
//       data: {
//         label: pickupOptions.map((option: string) => ({
//           label: option,
//         })),
//       },
//     })

//     return NextResponse.json(
//       { message: "Pickup options updated successfully", updatedLocations },
//       { status: 200 }
//     )
//   } catch (error) {
//     console.error("Error updating pickup options:", error)
//     return NextResponse.json(
//       { message: "Couldn't update pickup locations" },
//       { status: 500 }
//     )
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     const deliveryMethods = await prisma.deliveryMethod.findMany({
//       include: {
//         pickupOptions: true, // Include pickupOptions when fetching delivery methods
//       },
//     })

//     return NextResponse.json(deliveryMethods, { status: 200 })
//   } catch (error) {
//     console.error("Error fetching delivery methods:", error)
//     return NextResponse.json(
//       { error: "Couldn't fetch delivery methods" },
//       { status: 500 }
//     )
//   }
// }

// export async function PUT(req: Request) {
//   const { pickupOptions, deliveryMethodId } = await req.json()

//   // Check if deliveryMethodId is valid before proceeding
//   if (!deliveryMethodId || deliveryMethodId.length !== 24) {
//     // MongoDB ObjectID length is typically 24 characters
//     return NextResponse.json(
//       { error: "Invalid delivery method ID." },
//       { status: 400 }
//     )
//   }

//   try {
//     // Delete existing pickup options for the delivery method
//     await prisma.pickupOption.deleteMany({
//       where: { deliveryMethodId: deliveryMethodId },
//     })

//     // Re-create pickup options as provided
//     const createdOptions = await prisma.pickupOption.createMany({
//       data: pickupOptions.map((option: string) => ({
//         label: option,
//         deliveryMethodId: deliveryMethodId,
//       })),
//     })

//     return NextResponse.json({ createdOptions })
//   } catch (error) {
//     console.error("Error updating pickup options:", error)
//     return NextResponse.json(
//       { error: "Failed to update pickup options." },
//       { status: 500 }
//     )
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const pickupOptions = await prisma.pickupOptions.findMany()
    return NextResponse.json(pickupOptions, { status: 200 })
  } catch (error) {
    console.error("Error fetching pickup locations:", error)
    return NextResponse.json(
      { error: "Couldn't get all pickup locations" },
      { status: 500 }
    )
  }
}

// export async function POST(req: Request) {
//   const { region, city, address } = await req.json()

//   // const locations = await prisma.pickupOptions.create({
//   //   data:{}
//   // })
// }

// export async function PUT(req: Request) {
//   const pickupOptions = await req.json()

//   if (
//     !pickupOptions ||
//     !Array.isArray(pickupOptions) ||
//     pickupOptions.length === 0
//   ) {
//     return NextResponse.json(
//       { message: "Please select at least one pickup location" },
//       { status: 400 }
//     )
//   }

//   try {
//     // Delete existing pickup options
//     await prisma.pickupOptions.deleteMany({})

//     // Add the new pickup options
//     const updatedLocations = await prisma.pickupOptions.createMany({
//       data: pickupOptions.map((option: string) => ({ location: option })),
//     })

//     return NextResponse.json(updatedLocations, { status: 200 })
//   } catch (error) {
//     console.error("Error updating pickup locations:", error)
//     return NextResponse.json(
//       { message: "Couldn't update pickup locations" },
//       { status: 500 }
//     )
//   }
// }

export async function PUT(req: Request) {
  console.log("PUT request received")
  try {
    // Expect an object with a `pickupOptions` key
    const { pickupOptions } = await req.json() // Destructure the array from the request body
    console.log("Request body:", pickupOptions)

    // Validate that `pickupOptions` is an array
    if (!Array.isArray(pickupOptions)) {
      return NextResponse.json(
        { message: "Request body must be an array" },
        { status: 400 }
      )
    }

    if (pickupOptions.length === 0) {
      return NextResponse.json(
        { message: "Please select at least one pickup location" },
        { status: 400 }
      )
    }

    // Delete existing pickup options
    await prisma.pickupOptions.deleteMany({})

    // Add the new pickup options
    const updatedLocations = await prisma.pickupOptions.createMany({
      data: pickupOptions.map((option: string) => ({ location: option })),
    })

    return NextResponse.json(
      {
        message: "Pickup locations updated successfully",
        data: updatedLocations,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating pickup locations:", error)
    return NextResponse.json(
      { message: "Couldn't update pickup locations" },
      { status: 500 }
    )
  }
}
