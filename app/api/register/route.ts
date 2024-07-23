import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required!" });
    }
    // const user = await prisma.user.create({
    //   data: {
    //     name: name,
    //     email: email,
    //     hashedPassword: password,
    //   },
    // });
  } catch (error) {
    console.log(error);
  }
}
