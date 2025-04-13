import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import { ShippingAddress } from "@/types"

interface AddressFormProps {
  address: ShippingAddress
  onChange: (field: keyof ShippingAddress, value: string | boolean) => void
  onSave: () => void
}

const AddressForm = ({ address, onChange, onSave }: AddressFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={address.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={address.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="Your email address"
            type="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={address.address || ""}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Street address"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={address.city || ""}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="City"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">State/Region</Label>
          <Input
            id="region"
            value={address.region || ""}
            onChange={(e) => onChange("region", e.target.value)}
            placeholder="State or Region"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={address.country || ""}
            onChange={(e) => onChange("country", e.target.value)}
            placeholder="Country"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={address.phone || ""}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="Phone number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deliveryMethod">Delivery Method</Label>
          <Input
            id="deliveryMethod"
            value={address.deliveryMethod || ""}
            onChange={(e) => onChange("deliveryMethod", e.target.value)}
            placeholder="Home Delivery, Pickup, etc."
          />
        </div>
      </div>

      <Button onClick={onSave} className="mt-4 bg-green-500 hover:bg-green-600">
        <Save className="h-4 w-4 mr-2" />
        Save Address
      </Button>
    </div>
  )
}

export default AddressForm
