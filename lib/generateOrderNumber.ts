export function generateOrderNumber() {
  const prefix = "SG"
  const randomNumber = Math.floor(10000 + Math.random() * 90000)
  return `${prefix}${randomNumber}`
}
