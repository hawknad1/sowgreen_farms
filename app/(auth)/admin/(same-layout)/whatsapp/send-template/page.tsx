// app/send-template/page.tsx
"use client"

import { useState } from "react"

export default function SendTemplatePage() {
  const [conversationSid, setConversationSid] = useState("")
  const [contentSid, setContentSid] = useState("")
  const [to, setTo] = useState("")
  const [var1, setVar1] = useState("")
  const [var2, setVar2] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Use same author as above
  const author =
    process.env.NEXT_PUBLIC_WHATSAPP_SENDER || "whatsapp:+1234567890"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)
    setError(null)

    try {
      const res = await fetch(
        `/api/conversations/${conversationSid}/messages/template`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            author,
            to: `whatsapp:${to}`,
            contentSid,
            contentVariables: { "1": var1, "2": var2 },
          }),
        }
      )

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Unknown error")
      } else {
        setResult(`Template Message SID: ${data.messageSid}`)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Send a Template Message</h2>
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
          <label htmlFor="contentSid" className="block text-sm font-medium">
            Template ContentSid
          </label>
          <input
            type="text"
            id="contentSid"
            value={contentSid}
            onChange={(e) => setContentSid(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            placeholder="e.g. HXXXXX1234567890ABCDEF"
            required
          />
        </div>
        <div>
          <label htmlFor="to" className="block text-sm font-medium">
            Recipient WhatsApp (E.164, no 'whatsapp:')
          </label>
          <input
            type="tel"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            placeholder="+15554443333"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Variable 1</label>
          <input
            type="text"
            value={var1}
            onChange={(e) => setVar1(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            placeholder="e.g. 'Alice'"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Variable 2</label>
          <input
            type="text"
            value={var2}
            onChange={(e) => setVar2(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            placeholder="e.g. 'Order #12345'"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send Template
        </button>
      </form>

      {result && <p className="mt-4 text-green-700">{result}</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
    </div>
  )
}
