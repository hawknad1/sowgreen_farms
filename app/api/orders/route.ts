import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const status = searchParams.get("status") // Get the status query parameter
    const email = searchParams.get("email") // Get the email query parameter

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

    const emailFilter = email
      ? {
          shippingAddress: {
            email,
          },
        }
      : {}

    // Fetch orders with filters
    const orders = await prisma.order.findMany({
      where: {
        ...dateFilter,
        ...statusFilter, // Apply the status filter if present
        ...emailFilter,
      },
      include: {
        shippingAddress: true,
        dispatchRider: true,
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
  try {
    const {
      referenceNumber,
      orderNumber,
      total,
      shippingAddress,
      dispatchRider,
      deliveryFee,
      deliveryDate,
      userWhatsappOptIn,
      products,
      status,
      cardType,
      updatedOrderTotal,
      remainingAmount,
      updatedBalance,
      last4Digits,
      paymentMode,
      paymentAction,
      creditAppliedDeliveryFee,
      whatsappOptIn,
      creditAppliedTotal,
    } = await req.json()

    const whatsappOptInBool = Boolean(whatsappOptIn)

    // Validate required fields
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

    if (!products || !Array.isArray(products) || products.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "Products are required to create an order" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

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

    // // find User
    // const user = await prisma.user.findUnique({
    //   where: { email: shippingAddress.email },
    // })

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: shippingAddress.email },
    })

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    // Create a new shipping address
    const shippingAddressRecord = await prisma.shippingAddress.create({
      data: {
        name: shippingAddress.name,
        email: shippingAddress.email,
        address: shippingAddress.address,
        city: shippingAddress.city,
        region: shippingAddress.region,
        country: shippingAddress.country || "",
        phone: shippingAddress.phone,
        deliveryMethod: shippingAddress.deliveryMethod || "Not Specified",
        userId: user?.id,
      },
    })

    // Filter valid products and validate stock
    const validProducts = products.filter((productOrder: any) => {
      const { item } = productOrder

      if (!item || !item.productId || !item.variantId) {
        console.warn("Invalid product entry:", productOrder)
        return false
      }

      if (item.quantity > item.available) {
        console.warn("Insufficient stock for product:", item.productId)
        return false
      }

      return true
    })

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
        orderNumber,
        referenceNumber,
        cardType: cardType || null,
        last4Digits: last4Digits || null,
        paymentMode: paymentMode || "Unknown",
        paymentAction: paymentAction || "Pending",
        total,
        deliveryFee,
        deliveryDate,
        creditAppliedDeliveryFee,
        updatedOrderTotal,
        remainingAmount,
        userWhatsappOptIn,
        updatedBalance,
        creditAppliedTotal,
        whatsappOptIn: whatsappOptInBool,
        status,
        dispatchRider,
        user: {
          connect: { id: user?.id },
        },
        shippingAddress: {
          connect: { id: shippingAddressRecord.id },
        },
        products: {
          create: validProducts.map((productOrder: any) => {
            const { item } = productOrder
            return {
              product: {
                connect: { id: item.productId },
              },
              price: item.price, // Ensure price is passed here
              weight: item.weight, // Ensure weight is passed here
              unit: item.unit,
              quantity: item.quantity,
              quantityTotal: productOrder.total,
            }
          }),
        },
      },
      include: {
        shippingAddress: true,
        dispatchRider: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    })

    // Return the created order with full details
    return new NextResponse(JSON.stringify(order), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return new NextResponse(
      JSON.stringify({ message: "Couldn't create order" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
}
