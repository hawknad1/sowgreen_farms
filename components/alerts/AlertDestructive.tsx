// "use client"

// import { AlertCircle } from "lucide-react"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { useStaff } from "@/hooks/useStaff"
// import { Skeleton } from "../ui/skeleton"

// interface AlertDestructiveProps {
//   message: string
//   admin?: boolean
// }

// export function AlertDestructive({ message, admin }: AlertDestructiveProps) {
//   const { staff, loading, error } = useStaff()

//   console.log(staff, "support staff")
//   // const supportNumber = staff.map((s) => s.phone).slice(0, 2)
//   const supportNumbers = staff?.map((s) => s.phone).slice(0, 2) || []

//   // if (loading) return <Skeleton className="w-full h-20" />
//   // if (error) return <div>Error loading staff</div>

//   return (
//     <Alert variant="destructive" className="bg-red-500/15">
//       <AlertCircle className="h-4 w-4" />
//       <AlertTitle>Attention!</AlertTitle>
//       <AlertDescription>
//         {message}
//         {!admin && (
//           <span>{`Kindly call Sowgreen Organic on ${supportNumbers} for assistance.
//         Thank you!`}</span>
//         )}
//       </AlertDescription>
//     </Alert>
//   )
// }

// components/alert/AlertDestructive.tsx
"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useStaff } from "@/hooks/useStaff"
import { Skeleton } from "../ui/skeleton"

interface AlertDestructiveProps {
  message: string
  admin?: boolean
}

export function AlertDestructive({
  message,
  admin = false,
}: AlertDestructiveProps) {
  const { staff, loading, error } = useStaff()

  // Show loading state
  if (loading) {
    return <Skeleton className="w-full h-20" />
  }

  // Format phone numbers properly
  const supportNumbers = staff
    ?.map((s) => s.phone)
    .filter(Boolean) // Remove any null/undefined values
    .slice(0, 2)

  const phoneDisplay = supportNumbers?.length
    ? supportNumbers.join(" or ")
    : "our support team"

  return (
    <Alert variant="destructive" className="bg-red-500/15">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Attention!</AlertTitle>
      <AlertDescription className="space-y-1">
        <p>{message}</p>
        {!admin && (
          <p className="mt-2">
            Kindly call Sowgreen Organic on{" "}
            <span className="font-semibold">{phoneDisplay}</span> for
            assistance. Thank you!
          </p>
        )}
        {error && (
          <p className="text-xs text-muted-foreground mt-1">
            (Contact information temporarily unavailable)
          </p>
        )}
      </AlertDescription>
    </Alert>
  )
}
