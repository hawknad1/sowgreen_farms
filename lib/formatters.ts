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

export const truncate = (str: string, max: number): string =>
  str.length > max ? `${str.slice(0, max - 1)}…` : str

export const formatCurrency = (amount: number, currency: string): string =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount)

export const formatProductLine = (p: Product, titleLength: number): string => {
  const title = truncate(p.product.title, titleLength)
  if (p.available === false) return `❌ ${title}: *N/A*`

  const weight = p.weight ? ` ${p.weight}${p.unit}` : ""
  return `✅ ${p.quantity}x ${title}${weight} - ${formatCurrency(
    p.quantityTotal,
    "GHS"
  )}`
}
