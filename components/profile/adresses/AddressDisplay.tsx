import React from "react"
import { MapPin } from "lucide-react"
import { ShippingAddress } from "@/types"
import AddressContactInfo from "./AddressContactInfo"

interface AddressDisplayProps {
  address?: ShippingAddress
  activeUser: ShippingAddress
}

const AddressDisplay = ({ address, activeUser }: AddressDisplayProps) => {
  console.log(activeUser, "display")
  return (
    <div className="space-y-3">
      {activeUser.deliveryMethod && (
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {activeUser.deliveryMethod}
        </span>
      )}

      <div className="flex gap-2">
        <MapPin className="h-5 w-5 text-gray-400" />
        <div>
          <p className="text-gray-700 font-medium">{activeUser.name}</p>
          <p className="text-gray-700">
            {activeUser.address}, {activeUser.city}, {activeUser.region}
            {activeUser.country ? `, ${activeUser.country}` : ""}
          </p>
        </div>
      </div>

      <AddressContactInfo phone={activeUser.phone} email={activeUser.email} />
    </div>
  )
}

export default AddressDisplay
