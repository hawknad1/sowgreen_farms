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
} from "../../ui/dialog"
import { Button } from "../../ui/button"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Product } from "@/types"
import { Trash2 } from "lucide-react"

interface Props {
  product: Product
  children?: React.ReactNode
  className?: string
}

const DeleteProductDialog = ({ product, children, className }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(
          `Failed to delete product. Status: ${res.status} - ${result.message}`
        )
      }

      toast.success(`${product.title} deleted successfully!`)
      router.replace("/admin/products")
    } catch (error) {
      toast.error("Error deleting product.")
      console.error("Delete product error:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Button
          variant="destructive"
          className={`font-semibold w-full ${className}`}
        >
          Delete Product
        </Button> */}

        <Button
          variant="destructive"
          className={`gap-2 flex-1 sm:flex-initial w-full ${className}`}
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle>Delete {product.title}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-y-3 md:inline-flex">
          <Button
            variant="outline"
            disabled={isDeleting}
            onClick={() => router.back()} // Close the dialog without action
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete} // Removed passing product.id, as it's handled internally
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Proceed"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteProductDialog
