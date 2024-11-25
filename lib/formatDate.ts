export function formatDate(dateInput: string | Date): string {
  // Ensure the input is a Date object
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input")
  }

  // Define month and day names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]

  // Extract day, month, and year
  const dayOfWeek = dayNames[date.getDay()]
  const monthName = monthNames[date.getMonth()]
  const day = date.getDate()

  // Determine the ordinal suffix for the day
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th"

  // Format the date string
  return `${dayOfWeek}, ${monthName} ${day}${suffix}`
}
