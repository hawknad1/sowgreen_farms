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
    <DialogContent className="sm:max-w-[530px]">
      <DialogHeader>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogDescription>
          Make changes to your product here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <EditProductForm product={product} />
    </DialogContent>
  </Dialog>
)

export default EditProduct
