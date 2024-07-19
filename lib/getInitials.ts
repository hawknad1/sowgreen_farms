export default function getInitials(name: string) {
  // Split the name by spaces
  const nameParts = name.split(" ");

  // Map through each part and take the first letter
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase());

  // Join the initials together
  return initials.join("");
}

// Example usage
// const name = "John Doe";
// const initials = getInitials(name);
// console.log(initials); // Output: JD
