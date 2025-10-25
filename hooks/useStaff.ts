// lib/hooks/useStaff.ts
"use client"

import { useEffect, useState } from "react"
import { getStaff } from "@/lib/actions/getStaff"

export function useStaff() {
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getStaff()
        setStaff(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchStaff()
  }, [])

  return { staff, loading, error }
}
