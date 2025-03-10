// PaystackButton.tsx
import React, { ReactNode } from "react"
import { PaystackProps, callback } from "react-paystack/dist/types"

interface PaystackButtonProps extends PaystackProps {
  text?: string
  className?: string
  children?: ReactNode
  onSuccess?: callback
  onClose?: callback
  disabled?: boolean // Add the disabled prop
}

const PaystackButton: React.FC<PaystackButtonProps> = ({
  text,
  className,
  children,
  onSuccess,
  onClose,
  disabled = false, // Default value for disabled
  ...config // Spread remaining props (PaystackProps)
}) => {
  const handleClick = () => {
    if (!disabled && onSuccess) {
      onSuccess() // Call onSuccess only if not disabled
    }
  }

  return (
    <button
      className={className}
      onClick={handleClick} // Attach the click handler
      disabled={disabled} // Apply the disabled state
      {...(onClose ? { onMouseLeave: onClose } : {})} // Optional onClose handler
    >
      {children || text || "Pay Now"} {/* Default fallback text */}
    </button>
  )
}

export default PaystackButton
