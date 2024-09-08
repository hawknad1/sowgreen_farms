import React from "react"
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
  children: React.ReactNode
  className?: string
}

const DeleteProductDialog = ({ product, children, className }: Props) => {
  const router = useRouter()

  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/products/${product.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!res.ok) throw new Error("Failed to delete product")

      toast.success(`${product.title} deleted successfully!`)
      router.push("account/admin/products")
    } catch (error) {
      toast.error("Error deleting product.")
      console.error("Delete product error:", error)
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
            onClick={() => router.back()} // Close the dialog without action
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete(product.id)}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteProductDialog
