// import React from "react"

// interface CardProps {
//   children: React.ReactNode
//   className?: string
// }

// const Card = ({ children, className = "" }: CardProps) => {
//   return (
//     <div
//       className={`bg-white p-4 rounded-md border border-neutral-200 shadow-sm w-full  ${className}`}
//     >
//       {children}
//     </div>
//   )
// }

// export default Card

import React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
