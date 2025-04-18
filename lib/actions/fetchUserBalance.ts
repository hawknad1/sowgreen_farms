export const fetchUserBalance = async (
  email: string | undefined
): Promise<number> => {
  if (!email) {
    throw new Error("Email is required to fetch user balance")
  }

  const response = await fetch(`/api/user/${email}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch balance: ${response.statusText}`)
  }

  const userData = await response.json()
  return userData.balance
}
