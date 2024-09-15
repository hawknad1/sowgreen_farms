import React from "react"

interface MiddleCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className: string
}


const MiddleCard = ({ children, className }: MiddleCardProps) => {
  return (
    <div
      className={`flex items-center justify-center rounded-md px-3 cursor-pointer ${className}`}
    >
      {children}
    </div>
  )
}

export default MiddleCard
