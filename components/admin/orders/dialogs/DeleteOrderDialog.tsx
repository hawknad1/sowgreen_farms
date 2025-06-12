"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog"
import { Button } from "../../../ui/button"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Order } from "@/types"
import { TrashIcon } from "@heroicons/react/20/solid"

interface Props {
  order: Order
  children?: React.ReactNode
  className?: string
}

const DeleteOrderDialog = ({ order, className }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(
          errorData.message || `Failed to delete order. Status: ${res.status}`
        )
      }

      setIsOpen(false)
      toast.success(`Order deleted successfully!`)

      router.replace("/admin/orders")
    } catch (error: any) {
      toast.error(error.message || "Error deleting order.")
      console.error("Delete order error:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={order?.status === "delivered"}
          variant="destructive"
          className={`font-semibold w-full ${className}`}
        >
          <TrashIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Delete Order No. ${order.orderNumber}`}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this order? This action cannot be
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
            {isDeleting ? "Deleting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteOrderDialog
