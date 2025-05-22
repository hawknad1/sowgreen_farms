import { formatCurrency } from "../utils"
import { truncate } from "./truncate"

interface Product {
  quantity: number
  quantityTotal: number
  available: boolean
  weight?: number
  unit?: string
  product: {
    title: string
  }
}

export const formatProductLine = (p: Product, titleLength?: number): string => {
  const title = truncate(p.product.title, titleLength)
  if (p.available === false) {
    return `❌ ${title}: *N/A*` // Show product as unavailable
  }
  const weight = p.weight ? ` ${p.weight}${p.unit}` : ""
  return `✅ ${p.quantity}x ${title}${weight} - ${formatCurrency(
    p.quantityTotal,
    "GHS"
  )}`
}
