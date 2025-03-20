export async function getUserList() {
  try {
    const response = await fetch("/api/user", {
      method: "GET",
      cache: "no-store",
    })
    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}
