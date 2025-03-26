import { useState } from "react"

export function WhatsappOptIn() {
  const [whatsappOptIn, setWhatsappOptIn] = useState(false)
  console.log(whatsappOptIn, "whatsappOptIn")

  return (
    <form>
      {/* Other form fields */}
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          id="whatsapp-opt-in"
          checked={whatsappOptIn}
          onChange={(e) => setWhatsappOptIn(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="whatsapp-opt-in" className="ml-2 text-sm text-gray-700">
          Receive order updates via WhatsApp
        </label>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        You'll get shipping confirmations and delivery alerts
      </p>
    </form>
  )
}
