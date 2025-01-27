import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

export async function createMessage() {
  const message = await client.messages.create({
    body: "Hi there",
    from: "+13056767226",
    to: "+2330548332803",
  })

  console.log(message.body)
}
