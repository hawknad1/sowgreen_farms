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
import { DispatchRider, Staff } from "@/types"

interface Props {
  staff?: Staff
}

// Use forwardRef for DeleteLocationDialog
const DeleteStaffDialog = forwardRef<HTMLButtonElement, Props>(
  ({ staff }, ref) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleDelete = async () => {
      if (!location) return

      setIsDeleting(true)
      try {
        // Example API call to delete location
        const response = await fetch(`/api/management/staff/${staff.id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast.success("Staff deleted!")
          setIsOpen(false)
          window.location.reload()
        } else {
          toast.error("Failed to delete staff.")
        }
      } catch (error) {
        console.error(error)
        toast.error("An error occurred while deleting staff.")
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
            Delete Staff
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this staff ? This action cannot be
              undone.
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
DeleteStaffDialog.displayName = "DeleteStaffDialog"

export default DeleteStaffDialog
