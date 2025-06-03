// app/add-participant/page.tsx
"use client"

import { useState } from "react"

export default function AddParticipantPage() {
  const [conversationSid, setConversationSid] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)
    setError(null)

    try {
      const res = await fetch(
        `/api/conversations/${conversationSid}/participants`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber: `whatsapp:${phoneNumber}` }),
        }
      )

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Unknown error")
      } else {
        setResult(`Participant SID: ${data.participantSid}`)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Add Participant to Group</h2>
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
          <label htmlFor="phoneNumber" className="block text-sm font-medium">
            Participant WhatsApp Number (E.164, no 'whatsapp:')
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            placeholder="+15554443333"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Participant
        </button>
      </form>

      {result && <p className="mt-4 text-green-700">{result}</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
    </div>
  )
}
