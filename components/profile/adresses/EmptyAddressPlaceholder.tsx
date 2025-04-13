import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyAddressPlaceholderProps {
  isEditing: boolean
  onAddNew: () => void
}

const EmptyAddressPlaceholder = ({
  isEditing,
  onAddNew,
}: EmptyAddressPlaceholderProps) => {
  return (
    <>
      <div className="text-center py-8 text-gray-500">
        No address saved yet.
      </div>
      {isEditing && (
        <Button
          variant="outline"
          onClick={onAddNew}
          className="w-full mt-4 border-dashed border-gray-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      )}
    </>
  )
}

export default EmptyAddressPlaceholder
