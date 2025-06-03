// app/create-group/page.tsx
"use client"

import { useState } from "react"

export default function CreateGroupPage() {
  const [friendlyName, setFriendlyName] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)
    setError(null)

    try {
      const res = await fetch("/api/whatsapp/conversations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendlyName }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Unknown error")
      } else {
        setResult(`Conversation SID: ${data.conversationSid}`)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">
        Create a New WhatsApp Group
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="friendlyName" className="block text-sm font-medium">
            Group Name (friendlyName)
          </label>
          <input
            type="text"
            id="friendlyName"
            value={friendlyName}
            onChange={(e) => setFriendlyName(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            placeholder="e.g. 'Family Chat'"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Group
        </button>
      </form>

      {result && <p className="mt-4 text-green-700">{result}</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
    </div>
  )
}
