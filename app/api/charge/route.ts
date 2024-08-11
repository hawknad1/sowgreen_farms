import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // const body = {
    //   amount: 100,
    //   email: "customer@email.com",
    //   currency: "GHS",
    //   mobile_money: {
    //     phone: "0551234987",
    //     provider: "mtn",
    //   },
    // }

    const response = await axios.post("https://api.paystack.co/charge", body, {
      headers: {
        Authorization: `Bearer ${process.env.SECRET_KEY}`, // Replace SECRET_KEY with your actual key
        "Content-Type": "application/json",
      },
    })

    return NextResponse.json(response.data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
