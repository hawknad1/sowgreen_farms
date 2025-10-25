import { Staff } from "@/types"

export async function getStaff() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  try {
    const res = await fetch(`${baseUrl}/api/management/staff`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!res.ok) throw new Error("Couldnt fetch user!")
    const data = await res.json()
    const support = data.filter((s: Staff) =>
      s.jobTitle.includes("support staff")
    )
    return support
  } catch (error) {
    console.log(error)
  }
}
