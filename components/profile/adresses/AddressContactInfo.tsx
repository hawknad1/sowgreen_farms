import React from "react"
import { Phone, Mail } from "lucide-react"

interface AddressContactInfoProps {
  phone: string
  email: string
}

const AddressContactInfo = ({ phone, email }: AddressContactInfoProps) => {
  return (
    <>
      <div className="flex gap-2 items-center">
        <Phone className="h-4 w-4 text-gray-400" />
        <span className="text-gray-700">{phone}</span>
      </div>

      <div className="flex gap-2 items-center">
        <Mail className="h-4 w-4 text-gray-400" />
        <span className="text-gray-700">{email}</span>
      </div>
    </>
  )
}

export default AddressContactInfo
