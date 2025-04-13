import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Phone, Mail, User, Save } from "lucide-react"
import { toast } from "sonner"

interface PersonalInfoProps {
  user: {
    name: string
    email: string
    phone: string
    birthdate?: string
  }
  isEditing: boolean
  onSave: (updatedInfo: any) => void
}

const PersonalInfoCard = ({ user, isEditing, onSave }: PersonalInfoProps) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    birthdate: user.birthdate || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    toast.success("Personal information updated successfully!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5 text-green-500" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Date of Birth</Label>
              <Input
                id="birthdate"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              className="w-full md:w-auto bg-green-500 hover:bg-green-600"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Full Name</p>
                <p>{user.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Email Address</p>
                <p>{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Phone Number</p>
                <p>{user.phone}</p>
              </div>
            </div>
            {user.birthdate && (
              <div className="flex gap-2">
                <div className="h-5 w-5 text-gray-400 flex items-center justify-center">
                  🎂
                </div>
                <div>
                  <p className="text-sm font-medium">Date of Birth</p>
                  <p>{new Date(user.birthdate).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PersonalInfoCard
