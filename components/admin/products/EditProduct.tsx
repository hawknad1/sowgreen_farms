import { Product } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../../ui/dialog"
import { Button } from "../../ui/button"
import EditProductForm from "../../forms/EditProductForm"

interface Props {
  product?: Product
}

const EditProduct = ({ product }: Props) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="w-full font-semibold">
        Edit Product
      </Button>
    </DialogTrigger>
    <DialogContent className="w-full md:max-w-[750px] h-full md:max-h-[90vh] overflow-hidden">
      <DialogHeader>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogDescription>
          Make changes to your product here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      {/* Add scrollable wrapper for the form */}
      <div className="h-full max-h-[calc(90vh-100px)] overflow-y-auto scrollbar-thin">
        <EditProductForm product={product} />
      </div>
    </DialogContent>
  </Dialog>
)

export default EditProduct
