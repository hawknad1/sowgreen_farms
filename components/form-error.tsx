import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import React from "react"

interface FormErrorProps {
  message?: string
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null
  return (
    <div className="p-3 bg-destructive/15 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}
