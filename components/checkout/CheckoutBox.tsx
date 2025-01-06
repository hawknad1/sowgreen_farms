import React from "react"

const CheckoutBox = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`w-full h-fit rounded-lg bg-white shadow-sm border border-1 p-5 ${className}`}
    >
      {children}
    </div>
  )
}

export default CheckoutBox
