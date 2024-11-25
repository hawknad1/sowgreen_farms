// export const getNextDeliveryDate = () => {
//   const today = new Date()
//   const currentDay = today.getDay() // Sunday is 0, Monday is 1, ..., Saturday is 6

//   // Define delivery days: 3 = Wednesday, 6 = Saturday
//   const deliveryDays = [3, 6]

//   // Find the next delivery day
//   const nextDeliveryDay =
//     deliveryDays.find((day) => day > currentDay) ?? deliveryDays[0]

//   // Calculate the number of days to add
//   const daysUntilNextDelivery =
//     nextDeliveryDay > currentDay
//       ? nextDeliveryDay - currentDay
//       : 7 - currentDay + nextDeliveryDay

//   // Calculate the next delivery date
//   const nextDeliveryDate = new Date(today)
//   nextDeliveryDate.setDate(today.getDate() + daysUntilNextDelivery)

//   return nextDeliveryDate
// }

export const getUpcomingDeliveryDates = () => {
  const today = new Date()
  const currentDay = today.getDay() // Sunday is 0, Monday is 1, ..., Saturday is 6

  // Define delivery days: Wednesday (3) and Saturday (6)
  const deliveryDays = [3, 6]

  // Calculate the next two delivery dates
  const upcomingDeliveryDates = deliveryDays.map((day) => {
    const daysUntilDelivery =
      day >= currentDay ? day - currentDay : 7 - currentDay + day
    const deliveryDate = new Date(today)
    deliveryDate.setDate(today.getDate() + daysUntilDelivery)
    return deliveryDate
  })

  return upcomingDeliveryDates // [WednesdayDate, SaturdayDate]
}
