// import { NextResponse } from "next/server"
// import { Resend } from "resend"

// const resend = new Resend(process.env.RESEND_API_KEY)
// const toEmail = process.env.BUSINESS_EMAIL // Your business email

// export async function POST(request: Request) {
//   try {
//     const body = await request.json()

//     const { firstName, lastName, email, phone, orderNumber, subject, message } =
//       body

//     const emailSubject = `New Contact Form Submission: ${getSubjectText(subject)}`

//     const emailHtml = `
//       <h1>New Contact Form Submission</h1>
//       <p><strong>Name:</strong> ${firstName} ${lastName}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Phone:</strong> ${phone}</p>
//       ${orderNumber ? `<p><strong>Order Number:</strong> ${orderNumber}</p>` : ""}
//       <p><strong>Subject:</strong> ${getSubjectText(subject)}</p>
//       <p><strong>Message:</strong></p>
//       <p>${message}</p>
//     `

//     const data = await resend.emails.send({
//       from: "Contact Form <tech@zoroastique.com>",
//       to: toEmail,
//       subject: emailSubject,
//       html: emailHtml,
//       replyTo: email,
//     })

//     return NextResponse.json(data)
//   } catch (error) {
//     return NextResponse.json({ error }, { status: 500 })
//   }
// }

// function getSubjectText(value: string): string {
//   const subjects: Record<string, string> = {
//     order: "Order Issue",
//     delivery: "Delivery Problem",
//     product: "Product Question",
//     return: "Return/Refund",
//     account: "Account Help",
//     other: "Other Inquiry",
//   }
//   return subjects[value] || value
// }

import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.phone ||
      !body.subject ||
      !body.message
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const emailSubject = `New Contact Form Submission: ${getSubjectText(body.subject)}`

    const emailHtml = `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Phone:</strong> ${body.phone}</p>
      ${body.orderNumber ? `<p><strong>Order Number:</strong> ${body.orderNumber}</p>` : ""}
      <p><strong>Subject:</strong> ${getSubjectText(body.subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${body.message}</p>
    `

    const data = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // Update this with your domain
      to: process.env.BUSINESS_EMAIL || "tech@zoroastique.com", // Fallback email
      subject: emailSubject,
      html: emailHtml,
      replyTo: body.email,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function getSubjectText(value: string): string {
  const subjects: Record<string, string> = {
    order: "Order Issue",
    delivery: "Delivery Problem",
    product: "Product Question",
    return: "Return/Refund",
    account: "Account Help",
    other: "Other Inquiry",
  }
  return subjects[value] || value
}
