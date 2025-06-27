"use client"

import React, { useState, forwardRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { PartnerType } from "./PartnerForm"

interface Props {
  partner?: PartnerType
}

// Use forwardRef for DeleteLocationDialog
const DeletePartnerDialog = forwardRef<HTMLButtonElement, Props>(
  ({ partner }, ref) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleDelete = async () => {
      if (!partner) return

      setIsDeleting(true)
      try {
        // Example API call to delete location
        const response = await fetch(`/api/management/partners/${partner.id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast.success(`Partner "${partner.brand}" deleted successfully!`)
          setIsOpen(false)
          window.location.reload()
        } else {
          toast.error(`Failed to delete ${partner.brand} .`)
        }
      } catch (error) {
        console.error(error)
        toast.error("An error occurred while deleting the partner.")
      } finally {
        setIsDeleting(false)
      }
    }

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            ref={ref} // Forward the ref here
            variant="ghost"
            className="hover:bg-red-500/15 text-red-400 hover:text-red-500 w-full"
          >
            Delete Partner
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{partner?.brand}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

// Add displayName for forwardRef (useful for debugging)
DeletePartnerDialog.displayName = "DeletePartnerDialog"

export default DeletePartnerDialog
