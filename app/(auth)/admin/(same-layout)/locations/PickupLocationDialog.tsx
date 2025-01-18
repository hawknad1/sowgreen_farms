import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PickupOptions } from "../management/PickupOptions"

interface PickupLocationsDialogProps {
  isDialogOpen: boolean
  setIsDialogOpen: (method: boolean) => void
  closeModal: () => void
}

const PickupLocationsDialog: React.FC<PickupLocationsDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  closeModal,
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Pickup Locations</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>This is where you can manage all your pickup locations.</p>
        </div>
        <PickupOptions />
      </DialogContent>
    </Dialog>
  )
}

export default PickupLocationsDialog
