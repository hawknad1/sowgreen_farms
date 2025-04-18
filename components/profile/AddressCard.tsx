import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { toast } from "sonner"
import { Order, ShippingAddress } from "@/types"
import AddressForm from "./adresses/AddressForm"
import EmptyAddressPlaceholder from "./adresses/EmptyAddressPlaceholder"
import AddressDisplay from "./adresses/AddressDisplay"

interface UserType {
  id?: string
  name: string
  email: string
  phone?: string | null
  address?: string
  city?: string
  country?: string
  dateOfBirth?: string
  avatar?: string
  orders?: Array<Order>
  role?: string
  balance?: number
}

interface AddressCardProps {
  address?: ShippingAddress
  activeUser: any
  isEditing: boolean
  onSave: (address: ShippingAddress) => void
}

const AddressCard = ({
  address,
  activeUser,
  isEditing,
  onSave,
}: AddressCardProps) => {
  const [currentAddress, setCurrentAddress] = useState<ShippingAddress>({
    id: "",
    name: activeUser?.name || "",
    email: activeUser?.email || "",
    address: activeUser?.address || "",
    city: activeUser?.city || "",
    region: activeUser?.region || "",
    country: activeUser?.country || "",
    phone: activeUser?.phone || "",
    deliveryMethod: "Delivery Method",
  })

  console.log(activeUser, "activeUser===address")

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
          Home Address
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
            activeUser={activeUser}
            address={currentAddress}
            onChange={handleChange}
            onSave={handleSave}
          />
        ) : (
          <AddressDisplay address={currentAddress} activeUser={activeUser} />
        )}
      </CardContent>
    </Card>
  )
}

export default AddressCard
