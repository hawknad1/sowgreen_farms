export async function getUser(email: string) {
  try {
    const res = await fetch(`/api/user/${email}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!res.ok) throw new Error("Couldnt fetch user!")
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
  }
}
