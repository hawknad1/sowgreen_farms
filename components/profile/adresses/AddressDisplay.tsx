import React from "react"
import { MapPin } from "lucide-react"
import { ShippingAddress } from "@/types"
import AddressContactInfo from "./AddressContactInfo"

interface AddressDisplayProps {
  address: ShippingAddress
}

const AddressDisplay = ({ address }: AddressDisplayProps) => {
  return (
    <div className="space-y-3">
      {address.deliveryMethod && (
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {address.deliveryMethod}
        </span>
      )}

      <div className="flex gap-2">
        <MapPin className="h-5 w-5 text-gray-400" />
        <div>
          <p className="text-gray-700 font-medium">{address.name}</p>
          <p className="text-gray-700">
            {address.address}, {address.city}, {address.region}
            {address.country ? `, ${address.country}` : ""}
          </p>
        </div>
      </div>

      <AddressContactInfo phone={address.phone} email={address.email} />
    </div>
  )
}

export default AddressDisplay
