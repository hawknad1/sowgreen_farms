import React from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, Edit } from "lucide-react"

interface ProfileHeaderProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
  onEdit: () => void
  isEditing: boolean
}

const ProfileHeader = ({ user, onEdit, isEditing }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="relative">
        <Avatar className="h-24 w-24 border-4 border-white shadow">
          <div className="bg-gray-200 h-full w-full flex items-center justify-center text-2xl font-semibold text-gray-600">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
        </Avatar>
        {isEditing && (
          <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 shadow-lg">
            <Camera className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>
      </div>
      <Button
        onClick={onEdit}
        variant={isEditing ? "outline" : "default"}
        className={`${
          isEditing
            ? "border-red-500 text-red-500 hover:bg-red-50"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        <Edit className="mr-2 h-4 w-4" />
        {isEditing ? "Cancel Editing" : "Edit Profile"}
      </Button>
    </div>
  )
}

export default ProfileHeader
