import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const from = searchParams.get("from")
//     const to = searchParams.get("to")

//     // Build the date filter
//     const dateFilter =
//       from || to
//         ? {
//             createdAt: {
//               ...(from ? { gte: new Date(from) } : {}),
//               ...(to
//                 ? { lte: new Date(new Date(to).setHours(23, 59, 59, 999)) }
//                 : {}),
//             },
//           }
//         : {}

//     // Fetch orders with filters
//     const orders = await prisma.order.findMany({
//       where: dateFilter,
//       include: {
//         shippingAddress: true,
//         products: {
//           include: {
//             product: true,
//           },
//         },
//       },
//     })

//     return NextResponse.json(orders, { status: 200 })
//   } catch (error) {
//     console.error("Error fetching orders:", error)
//     return NextResponse.json(
//       { message: "Couldn't fetch orders" },
//       { status: 500 }
//     )
//   }
// }

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const status = searchParams.get("status") // Get the status query parameter

    // Build the date filter
    const dateFilter =
      from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to
                ? { lte: new Date(new Date(to).setHours(23, 59, 59, 999)) }
                : {}),
            },
          }
        : {}

    // If status is provided, add it to the filter
    const statusFilter = status ? { status } : {}

    // Fetch orders with filters
    const orders = await prisma.order.findMany({
      where: {
        ...dateFilter,
        ...statusFilter, // Apply the status filter if present
      },
      include: {
        shippingAddress: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    })

    // Check if any orders were fetched
    if (orders.length === 0) {
      return NextResponse.json(
        { message: "You have no orders" },
        { status: 400 }
      )
    }

    // Return fetched orders
    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { message: "Couldn't fetch orders" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const {
    referenceNumber,
    orderNumber,
    total,
    shippingAddress,
    // deliveryMethod,
    dispatchRider,
    deliveryFee,
    deliveryDate,
    products,
    status,
    cardType,
    last4Digits,
    paymentMode,
    paymentAction,
  } = await req.json()

  // Validation for required fields
  if (!shippingAddress || !shippingAddress.address) {
    return new NextResponse(
      JSON.stringify({ message: "Shipping address is incomplete" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  try {
    // Check if an order with the given order number already exists
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber },
    })

    if (existingOrder) {
      return new NextResponse(
        JSON.stringify({ message: "Order number already exists" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Create a new shipping address if it doesn't exist
    const shippingAddressRecord = await prisma.shippingAddress.create({
      data: {
        name: shippingAddress.name,
        email: shippingAddress.email,
        address: shippingAddress.address,
        city: shippingAddress.city,
        region: shippingAddress.region,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
        deliveryMethod: shippingAddress.deliveryMethod,
      },
    })
    // }

    // Validate each product in the products array
    const validProducts = products.filter((productOrder: any) => {
      if (!productOrder?.item || !productOrder?.item?.id) {
        console.warn("Invalid product entry:", productOrder)
        return false
      }
      return true
    })

    // If no valid products, return an error
    if (validProducts.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No valid products found in the order" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber,
        referenceNumber: referenceNumber,
        cardType,
        last4Digits,
        paymentMode,
        paymentAction,
        total: total,
        // deliveryMethod: deliveryMethod,
        deliveryFee,
        deliveryDate,
        status,
        dispatchRider,
        shippingAddress: {
          connect: { id: shippingAddressRecord.id }, // Connect to the existing or newly created shipping address
        },
        products: {
          create: validProducts.map((productOrder: any) => {
            return {
              product: {
                connect: { id: productOrder.item.id }, // Safely reference item id
              },
              quantity: productOrder.quantity,
              quantityTotal: productOrder.total,
            }
          }),
        },
      },
      include: {
        shippingAddress: true,
        products: {
          include: {
            product: true, // Include product details in the response
          },
        },
      },
    })

    return new NextResponse(JSON.stringify(order), {
      status: 200,
    })
  } catch (error) {
    // Handle any other errors
    console.error("Error creating order:", error)
    return new NextResponse(
      JSON.stringify({ message: "Couldn't create order" }),
      { status: 500 }
    )
  }
}
