import prisma from "@/lib/prismadb";
import { CheckoutSchema } from "@/schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, address, email, city, region, country, phone } =
      await req.json();
    const validation = CheckoutSchema.safeParse({
      name,
      address,
      email,
      city,
      region,
      country,
      phone,
    });

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const customerAddress = await prisma.shippingAddress.create({
      data: {
        name,
        address,
        email,
        city,
        region,
        country,
        phone,
      },
    });
    return NextResponse.json(customerAddress, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
