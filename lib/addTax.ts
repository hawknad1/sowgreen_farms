// const subtotal = 200

// 5 + 5 + 2 + 200

// export const addTax = (subtotal: number) => {
//   const getFund = (2.5 / 100) * subtotal
//   const nhil = (2.5 / 100) * subtotal
//   const covid = (1 / 100) * subtotal
//   const levies = getFund + nhil + covid + subtotal
//   const vat = (15 / 100) * levies
//   return vat
// }

export const addTax = (subtotal: number) => {
  const taxRates = {
    getFund: 2.5 / 100,
    nhil: 2.5 / 100,
    covid: 1 / 100,
    vat: 15 / 100,
  }

  const calculateTax = (rate: number) => rate * subtotal

  const getFund = calculateTax(taxRates.getFund)
  const nhil = calculateTax(taxRates.nhil)
  const covid = calculateTax(taxRates.covid)

  const levies = subtotal + getFund + nhil + covid
  const vat = calculateTax(taxRates.vat) * (levies / subtotal) // VAT on levies

  return vat + subtotal
}
