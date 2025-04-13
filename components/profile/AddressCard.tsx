import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { toast } from "sonner"
import { ShippingAddress } from "@/types"
import AddressForm from "./adresses/AddressForm"
import EmptyAddressPlaceholder from "./adresses/EmptyAddressPlaceholder"
import AddressDisplay from "./adresses/AddressDisplay"

interface AddressCardProps {
  address?: ShippingAddress
  isEditing: boolean
  onSave: (address: ShippingAddress) => void
}

const AddressCard = ({ address, isEditing, onSave }: AddressCardProps) => {
  const [currentAddress, setCurrentAddress] = useState<ShippingAddress>({
    id: "",
    name: "",
    email: "",
    address: "",
    city: "",
    region: "",
    country: "",
    phone: "",
    deliveryMethod: "Delivery Method",
  })

  useEffect(() => {
    if (address) {
      setCurrentAddress(address)
    }
  }, [address])

  const handleChange = (
    field: keyof ShippingAddress,
    value: string | boolean
  ) => {
    setCurrentAddress((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Validate address
    if (
      !currentAddress.address?.trim() ||
      !currentAddress.city?.trim() ||
      !currentAddress.region?.trim()
    ) {
      toast.error("Please complete all required address fields")
      return
    }

    onSave(currentAddress)
  }

  const handleAddNew = () => {
    // This would be implemented if we wanted to add a new address
    // For now we'll just ensure currentAddress is initialized properly
    setCurrentAddress({
      id: "",
      name: "",
      email: "",
      address: "",
      city: "",
      region: "",
      country: "",
      phone: "",
      deliveryMethod: "Home Delivery",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-green-500" />
          Delivery Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!address && !isEditing ? (
          <EmptyAddressPlaceholder
            isEditing={isEditing}
            onAddNew={handleAddNew}
          />
        ) : isEditing ? (
          <AddressForm
            address={currentAddress}
            onChange={handleChange}
            onSave={handleSave}
          />
        ) : (
          <AddressDisplay address={currentAddress} />
        )}
      </CardContent>
    </Card>
  )
}

export default AddressCard
