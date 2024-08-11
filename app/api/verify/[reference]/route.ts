import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const reference = url.searchParams.get("reference")

  if (!reference) {
    return NextResponse.json(
      { message: "Reference query parameter is missing" },
      { status: 400 }
    )
  }

  const apiUrl = `https://api.paystack.co/transaction/verify/${reference}`
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_KEY}`, // Replace with your actual secret key
    },
  }

  try {
    const response = await fetch(apiUrl, options)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log(data)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
