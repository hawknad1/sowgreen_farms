import React from "react"
import { Product } from "@/types"
import { Dialog, DialogOverlay, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface EditProductModalProps {
  open: boolean // Change isOpen to open
  onClose: () => void
  product: Product | null
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  onClose,
  product,
}) => {
  if (!product) return null

  return (
    <Dialog open={open}>
      {" "}
      {/* Change isOpen to open */}
      <DialogOverlay />
      <DialogContent>
        <h2 className="text-xl font-semibold">Edit Product</h2>
        <form className="mt-4">
          <div>
            <label>Product Name</label>
            <input type="text" defaultValue={product.title} className="input" />
          </div>
          <div>
            <label>Price</label>
            <input
              type="number"
              defaultValue={product.price}
              className="input"
            />
          </div>
          {/* Add more fields as needed */}
          <div className="mt-4">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProductModal
