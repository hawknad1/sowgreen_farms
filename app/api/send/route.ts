import { EmailTemplate } from "@/emails/EmailTemplate"
import { OrderConfirmation } from "@/emails/OrderConfirmation"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const body = await req.text() // Get raw text body
  console.log("Raw request body:", body)

  if (!body) {
    return new Response("Empty body", { status: 400 })
  }

  try {
    const {
      referenceNumber,
      orderNumber,
      total,
      shippingAddress,
      deliveryMethod,
      products,
    } = JSON.parse(body) // Parse the body into JSON

    console.log("Parsed body:", {
      referenceNumber,
      orderNumber,
      total,
      shippingAddress,
      deliveryMethod,
      products,
    })
    const firstName = shippingAddress.name.split(" ")[0]
    // Continue with the rest of your logic
    const { data, error } = await resend.emails.send({
      from: "Sowgreen Farms <onboarding@resend.dev>",
      to: ["tech@zoroastique.com"],
      subject: "Hello world",
      react: OrderConfirmation({ firstName }),
    })

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 500 })
    }

    return new Response(JSON.stringify(data))
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return new Response("Invalid JSON", { status: 400 })
  }
}
