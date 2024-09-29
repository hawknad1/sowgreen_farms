export function formatName(name: string) {
  const firstName = name.split(" ")[0] // Get the first name
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase() // Capitalize the first letter
}
