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
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { CitiesWithFees } from "@/types"

interface Props {
  location?: CitiesWithFees
}

// Use forwardRef for DeleteLocationDialog
const DeleteLocationDialog = forwardRef<HTMLButtonElement, Props>(
  ({ location }, ref) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleDelete = async () => {
      if (!location) return

      setIsDeleting(true)
      try {
        // Example API call to delete location
        const response = await fetch(`/api/cities/${location.id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast.success(`Location "${location.city}" deleted successfully!`)
          setIsOpen(false)
          window.location.reload()
        } else {
          toast.error("Failed to delete location.")
        }
      } catch (error) {
        console.error(error)
        toast.error("An error occurred while deleting the location.")
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
            Delete Location
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the location "{location?.city}"?
              This action cannot be undone.
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
DeleteLocationDialog.displayName = "DeleteLocationDialog"

export default DeleteLocationDialog