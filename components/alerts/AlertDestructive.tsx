// "use client"

// import { AlertCircle } from "lucide-react"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { useStaff } from "@/hooks/useStaff"
// import { Skeleton } from "../ui/skeleton"
// import { useEffect, useState } from "react"
// import { Staff } from "@/types"

// interface AlertDestructiveProps {
//   message: string
//   admin?: boolean
// }

// export function AlertDestructive({ message, admin }: AlertDestructiveProps) {
//   const [staffData, setStaffData] = useState<any[]>([])

//   useEffect(() => {
//     async function getStaff() {
//       try {
//         const res = await fetch("/api/management/staff")
//         const data = await res.json()
//         const supportNumbers =
//           data
//             ?.filter((s: Staff) => s.jobTitle.includes("support staff"))
//             .slice(0, 2) || []
//         setStaffData(supportNumbers.map((s: Staff) => s.phone).join(" or "))
//       } catch (error) {
//         console.error("Error fetching staff:", error)
//       }
//     }

//     getStaff()
//   }, [])

//   return (
//     <Alert variant="destructive" className="bg-red-500/15">
//       <AlertCircle className="h-4 w-4" />
//       <AlertTitle>Attention!</AlertTitle>
//       <AlertDescription>
//         {message}
//         {!admin && (
//           <span>{`Kindly call Sowgreen Organic on ${staffData} for assistance.
//         Thank you!`}</span>
//         )}
//       </AlertDescription>
//     </Alert>
//   )
// }

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface Staff {
  id: string
  jobTitle: string
  phone: string
}

interface AlertDestructiveProps {
  message: string
  admin?: boolean
}

export function AlertDestructive({
  message,
  admin = false,
}: AlertDestructiveProps) {
  const [supportPhones, setSupportPhones] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  useEffect(() => {
    // Only fetch if user is not an admin
    // if (admin) return

    const fetchSupportStaff = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${baseUrl}/api/management/staff`)

        if (!response.ok) {
          throw new Error("Failed to fetch staff data")
        }

        const data: Staff[] = await response.json()

        const supportStaff = data
          .filter((staff) =>
            staff.jobTitle.toLowerCase().includes("support staff")
          )
          .slice(0, 2)
          .map((staff) => staff.phone)
          .filter(Boolean) // Remove any null/undefined phone numbers

        setSupportPhones(
          supportStaff.length > 0 ? supportStaff.join(" or ") : "0241 234 234"
        )
      } catch (err) {
        console.error("Error fetching staff:", err)
        setError("Unable to load contact information")
        // setSupportPhones("our support team")
        setSupportPhones("0241 234 234")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSupportStaff()
  }, [admin])

  return (
    <Alert variant="destructive" className="bg-red-500/15">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Attention!</AlertTitle>
      <AlertDescription>
        {message}
        {!admin && (
          <span className="block mt-2">
            Kindly call Sowgreen Organic on {supportPhones} for assistance.
            Thank you!
          </span>
        )}
      </AlertDescription>
    </Alert>
  )
}
