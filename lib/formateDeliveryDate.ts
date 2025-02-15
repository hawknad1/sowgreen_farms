export function formatDeliveryDate(dateString: Date) {
  const date = new Date(dateString) // Parse the date string

  // Format full day (e.g., Saturday)
  const day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date)

  // Format month (e.g., Nov)
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    date
  )

  const year = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(
    date
  )

  // Get the day of the month (e.g., 30)
  const dayOfMonth = date.getDate()

  // Add ordinal suffix to the day
  const ordinalSuffix = (n: any) => {
    if (n >= 11 && n <= 13) return "th"
    switch (n % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  return `${day}, ${month} ${dayOfMonth}${ordinalSuffix(dayOfMonth)}, ${year}`
}
