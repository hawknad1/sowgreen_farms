// app/send-message/page.tsx
"use client"

import { useState } from "react"

export default function SendMessagePage() {
  const [conversationSid, setConversationSid] = useState("")
  const [body, setBody] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // The "author" is your WhatsApp sender (TWILIO_WHATSAPP_SENDER)
  const author =
    process.env.NEXT_PUBLIC_WHATSAPP_SENDER || "whatsapp:+1234567890"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)
    setError(null)

    try {
      const res = await fetch(
        `/api/conversations/${conversationSid}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ author, body }),
        }
      )

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Unknown error")
      } else {
        setResult(`Message SID: ${data.messageSid}`)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Send a Text Message</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="conversationSid"
            className="block text-sm font-medium"
          >
            Conversation SID
          </label>
          <input
            type="text"
            id="conversationSid"
            value={conversationSid}
            onChange={(e) => setConversationSid(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            placeholder="e.g. CHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            required
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium">
            Message Body
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Hello everyone!"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>

      {result && <p className="mt-4 text-green-700">{result}</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
    </div>
  )
}
