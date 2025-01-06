import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import React from "react"

interface AlertDestructiveProps {
  message: string
}

export function AlertDestructive({ message }: AlertDestructiveProps) {
  return (
    <Alert variant="destructive" className="bg-red-500/15">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="">{message}</AlertDescription>
    </Alert>
  )
}
