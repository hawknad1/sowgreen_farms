import { Order, ProductOrder } from "@/types"

// lib/whatsapp-format.ts
export function toE164Ghana(input?: string): string | null {
  if (!input) return null
  const digits = input.replace(/[^\d]/g, "")
  if (/^0\d{9}$/.test(digits)) return `+233${digits.slice(1)}`
  if (/^233\d{9}$/.test(digits)) return `+${digits}`
  if (/^\+233\d{9}$/.test(input)) return input
  return null
}

const ORD = ["th", "st", "nd", "rd"]
function ordinal(n: number) {
  const v = n % 100
  return n + (ORD[(v - 20) % 10] || ORD[v] || ORD[0])
}
export function formatPickupDate(dateIso?: string, tz = "Africa/Accra") {
  if (!dateIso) return "To be confirmed"
  const d = new Date(dateIso)
  if (isNaN(d.getTime())) return "To be confirmed"
  const weekday = d.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: tz,
  })
  const month = d.toLocaleDateString("en-US", { month: "short", timeZone: tz })
  const day = d.toLocaleDateString("en-US", { day: "numeric", timeZone: tz })
  const year = d.toLocaleDateString("en-US", { year: "numeric", timeZone: tz })
  return `${weekday}, ${month} ${ordinal(Number(day))}, ${year}`
}

export function compactLocation(addr?: string, city?: string) {
  const a = (addr || "").trim()
  const c = (city || "").trim()
  return [a, c].filter(Boolean).join(", ") || "To be confirmed"
}

// Exactly the grouped bullet-list you showed
export function buildItemsList(order: Order) {
  const groups: Record<string, ProductOrder[]> = {}
  order.products.forEach((item) => {
    const partner = item.product.partner?.brand || "SOWGREEN ORGANIC"
    ;(groups[partner] ||= []).push(item)
  })
  let out = ""
  for (const [partner, items] of Object.entries(groups)) {
    out += `🏪 *${partner}*\n`
    for (const it of items) {
      const title =
        it.product.title.length > 25
          ? it.product.title.slice(0, 22) + "..."
          : it.product.title
      const unit = it.weight && it.unit ? ` ${it.weight}${it.unit}` : ""
      const qty = it.quantity || 1
      const lineTotal = Number(it.quantityTotal ?? 0).toFixed(2)
      out += `✅ ${qty}x ${title}${unit} - GHS ${lineTotal}\n`
    }
    out += "\n"
  }
  return out.trim()
}
