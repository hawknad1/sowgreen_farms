// // lib/hooks/useStaff.ts
// "use client"

// import { useEffect, useState } from "react"
// import { getStaff } from "@/lib/actions/getStaff"

// export function useStaff() {
//   const [staff, setStaff] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<Error | null>(null)

//   useEffect(() => {
//     const fetchStaff = async () => {
//       try {
//         const data = await getStaff()
//         setStaff(data)
//       } catch (err) {
//         setError(err as Error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStaff()
//   }, [])

//   return { staff, loading, error }
// }

// hooks/useStaff.ts
"use client"

import { useEffect, useState } from "react"
import { getStaff, type Staff } from "@/lib/actions/getStaff"

interface UseStaffReturn {
  staff: Staff[]
  loading: boolean
  error: Error | null
}

export function useStaff(): UseStaffReturn {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchStaff = async () => {
      try {
        setLoading(true)
        const data = await getStaff()

        if (mounted && data) {
          setStaff(data)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch staff")
          )
          console.error("Error fetching staff:", err)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchStaff()

    return () => {
      mounted = false
    }
  }, [])

  return { staff, loading, error }
}
