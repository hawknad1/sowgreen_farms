export const getActiveUser = async (user: any) => {
  if (!user?.email) return

  try {
    const res = await fetch(`/api/user/${user.email}`, {
      method: "GET",
      cache: "no-store",
    })
    if (res.ok) {
      const active = await res.json()
      return active
    } else {
      console.error("Failed to fetch user details:", res.statusText)
    }
  } catch (error) {
    console.error("Failed to fetch user details:", error)
  }
}
