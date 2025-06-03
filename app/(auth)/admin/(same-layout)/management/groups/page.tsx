// app/page.tsx
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Actions</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <Link
            href="/admin/whatsapp/create-group"
            className="text-blue-600 hover:underline"
          >
            Create a New WhatsApp Group
          </Link>
        </li>
        <li>
          <Link
            href="/admin/whatsapp/add-participant"
            className="text-blue-600 hover:underline"
          >
            Add Participant to a Group
          </Link>
        </li>
        <li>
          <Link
            href="/admin/whatsapp/send-message"
            className="text-blue-600 hover:underline"
          >
            Send a Text Message
          </Link>
        </li>
        <li>
          <Link
            href="/admin/whatsapp/send-template"
            className="text-blue-600 hover:underline"
          >
            Send a Template Message
          </Link>
        </li>
      </ul>
    </div>
  )
}
