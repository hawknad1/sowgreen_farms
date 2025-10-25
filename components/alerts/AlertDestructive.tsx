"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useStaff } from "@/hooks/useStaff"
import { Skeleton } from "../ui/skeleton"

interface AlertDestructiveProps {
  message: string
  admin?: boolean
}

export function AlertDestructive({ message, admin }: AlertDestructiveProps) {
  const { staff, loading, error } = useStaff()

  console.log(staff, "support staff")
  // const supportNumber = staff.map((s) => s.phone).slice(0, 2)
  const supportNumbers = staff?.map((s) => s.phone).slice(0, 2) || []

  // if (loading) return <Skeleton className="w-full h-20" />
  // if (error) return <div>Error loading staff</div>

  return (
    <Alert variant="destructive" className="bg-red-500/15">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Attention!</AlertTitle>
      <AlertDescription>
        {message}
        {!admin && (
          <span>{`Kindly call Sowgreen Organic on ${supportNumbers} for assistance.
        Thank you!`}</span>
        )}
      </AlertDescription>
    </Alert>
  )
}
