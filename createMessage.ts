// Download the helper library from https://www.twilio.com/docs/node/install
// const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";
import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

async function createMessage() {
  const message = await client.messages.create({
    body: "Hello there!",
    from: "whatsapp:+13056767226",
    to: "whatsapp:+233548332803",
  })

  console.log(message.body)
}

createMessage()
