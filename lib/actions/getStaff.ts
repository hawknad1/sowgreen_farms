// import { Staff } from "@/types"

// export async function getStaff() {
//   try {
//     const res = await fetch(`/api/management/staff`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//       cache: "no-store",
//     })

//     if (!res.ok) throw new Error("Couldnt fetch user!")
//     const data = await res.json()
//     const support = data.filter((s: Staff) =>
//       s.jobTitle.includes("support staff")
//     )
//     return support
//   } catch (error) {
//     console.log(error)
//   }
// }

// lib/actions/getStaff.ts
export interface Staff {
  id: string
  name: string
  phone: string
  jobTitle: string
  email?: string
}

export async function getStaff(): Promise<Staff[]> {
  // Use absolute URL in production
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")

  try {
    const res = await fetch(`${baseUrl}/api/management/staff`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch staff: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    if (!Array.isArray(data)) {
      console.error("Invalid staff data format:", data)
      return []
    }

    const support = data.filter((s: Staff) =>
      s.jobTitle?.toLowerCase().includes("support staff")
    )

    console.log("Support staff loaded:", support.length, support)

    return support
  } catch (error) {
    console.error("Error in getStaff:", error)
    throw error // Re-throw to let the hook handle it
  }
}
