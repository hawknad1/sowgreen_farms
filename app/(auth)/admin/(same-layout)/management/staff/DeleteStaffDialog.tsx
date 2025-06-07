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
import { Staff } from "@/types"

interface Props {
  staff?: Staff
}

// Use forwardRef for DeleteLocationDialog
const DeleteStaffDialog = forwardRef<HTMLButtonElement, Props>(
  ({ staff }, ref) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const deleteParticipant = async (phone: string) => {
      const number = phone.slice(1)
      const convertedTowhatsapp = `whatsapp:+233${number}`

      try {
        // First, find the conversation participant associated with this staff
        const findResponse = await fetch(
          `/api/whatsapp/conversations/get-participant`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone: convertedTowhatsapp }),
          }
        )

        if (!findResponse.ok) {
          console.log("No participant found for this staff")
          return
        }

        const participantData = await findResponse.json()

        if (participantData.participantSid) {
          // Delete the participant from Twilio conversation
          const deleteResponse = await fetch(
            `/api/whatsapp/conversations/all-participants/${participantData.conversation.twilioSid}/remove-participant`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                participantSid: participantData.participantSid,
              }),
            }
          )

          if (!deleteResponse.ok) {
            console.error("Failed to delete participant")
          }
        }
      } catch (error) {
        console.error("Error deleting participant:", error)
      }
    }

    const handleDelete = async () => {
      if (!location) return

      setIsDeleting(true)
      try {
        // First delete the participant if staff has phone
        if (staff.phone) {
          await deleteParticipant(staff.phone)
        }

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
              // onClick={() => console.log(staff, "staff")}
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
