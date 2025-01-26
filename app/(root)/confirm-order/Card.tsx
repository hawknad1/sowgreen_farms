import React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`bg-white p-4 rounded-md border border-neutral-200 shadow-sm h-[300px] w-full  ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
