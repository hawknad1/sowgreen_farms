import OrderConfirmationEmail from "@/emails/OrderConfirmationEmail"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { order } = await request.json()
    console.log("Received order:", order)

    if (!order) {
      throw new Error("Order data is missing")
    }

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["tech@zoroastique.com"],
      subject: "Order Confirmation",
      react: OrderConfirmationEmail({ order }),
    })

    if (error) {
      console.error("Email sending error:", error)
      return new Response(JSON.stringify({ error }), { status: 500 })
    }

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error }, { status: 500 })
  }
}
