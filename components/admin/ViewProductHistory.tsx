import { Timer, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Product } from "@/types"
import ProductHistory from "./ProductHistory"
import { PencilSquareIcon } from "@heroicons/react/20/solid"

interface Props {
  product: Product
  children?: React.ReactNode
  className?: string
}

const ViewProductHistoryDialog = ({ product, children, className }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className={`w-full font-medium cursor-pointer ${className}`}
        >
          <div className="flex justify-center items-center gap-2 w-full">
            <Timer className="h-4 w-4 text-gray-700" />
            <span className="text-sm">Product History</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:max-w-[750px] h-full md:max-h-[90vh] overflow-hidden">
        {/* <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to your product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader> */}
        {/* Add scrollable wrapper for the form */}
        <div className="h-full max-h-[calc(90vh-100px)] overflow-y-auto scrollbar-thin">
          <ProductHistory product={product} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewProductHistoryDialog
