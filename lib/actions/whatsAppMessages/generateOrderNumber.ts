// export function generateOrderNumber() {
//   const prefix = "SG"
//   const randomNumber = Math.floor(10000 + Math.random() * 90000)
//   return `${prefix}${randomNumber}`
// }

export function generateOrderNumber() {
  const prefix = "SG"
  const randomNumber = Math.floor(10000 + Math.random() * 90000)
  const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  const randomTwoDigits = Math.floor(10 + Math.random() * 90)

  return `${prefix}${randomNumber}${randomLetter}${randomTwoDigits}`
}
