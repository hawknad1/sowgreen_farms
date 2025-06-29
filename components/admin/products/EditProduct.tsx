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
import { PencilSquareIcon } from "@heroicons/react/20/solid"

interface Props {
  product?: Product
  className?: string
  variant?: "ghost" | "outline"
  children?: React.ReactNode
}

const EditProduct = ({ product, children, className, variant }: Props) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant={"outline"}
        className={`w-full font-medium cursor-pointer ${className}`}
      >
        <div className="flex justify-center items-center gap-2 w-full">
          <PencilSquareIcon className="h-4 w-4 text-gray-700" />
          <span className="text-sm"> Edit Product</span>
        </div>
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
