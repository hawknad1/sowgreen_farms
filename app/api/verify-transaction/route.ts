import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { reference } = body

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required" },
        { status: 400 }
      )
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_TEST_KEY}`, // Paystack secret key from env
          "Content-Type": "application/json",
        },
      }
    )

    const data = await response.json()

    if (data.status) {
      return NextResponse.json({
        status: "success",
        paymentMode: data.data.channel, // 'card', 'bank', etc.
        cardType: data.data.authorization.card_type, // 'Visa', 'MasterCard', etc.
        last4Digits: data.data.authorization.last4,
      })
    } else {
      return NextResponse.json(
        { error: "Failed to verify transaction" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error verifying transaction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}