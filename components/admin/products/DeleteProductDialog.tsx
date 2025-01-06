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

interface Props {
  product: Product
  children?: React.ReactNode
  className?: string
}

const DeleteProductDialog = ({ product, children, className }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  // const handleDelete = async () => {
  //   try {
  //     const res = await fetch(`/api/products/${product.id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })

  //     if (!res.ok) {
  //       throw new Error(`Failed to delete product. Status: ${res.status}`)
  //     }

  //     toast.success(`${product.title} deleted successfully!`)
  //     router.replace("/admin/products") // Optional: Use replace to avoid history back
  //   } catch (error) {
  //     toast.error("Error deleting product.")
  //     console.error("Delete product error:", error)
  //   }
  // }

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
        <Button
          variant="destructive"
          className={`font-semibold w-full ${className}`}
        >
          Delete Product
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {product.title}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
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
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteProductDialog
