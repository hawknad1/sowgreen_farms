import prisma from "@/lib/prismadb";
import { RegisterSchema } from "@/schemas";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
  try {
    const { name, email, password } = await req.json();
    const validation = RegisterSchema.safeParse({ name, email, password });
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Sorry email already exist" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json({ newUser }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
