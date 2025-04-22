export function capitalizeName(name: string): string {
  return name
    ?.trim() // Remove extra spaces
    .split(" ") // Split by space to handle first and last names
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter, lowercase the rest
    .join(" ") // Join back into a single string
}
